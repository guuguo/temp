// @flow
import React, { Component } from 'react';
import { CircularProgress } from 'material-ui/Progress';
import List from 'material-ui/List';
// import { Link } from 'react-router-dom';
import Snackbar from 'material-ui/Snackbar';
import copy from 'copy-to-clipboard';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import TransitionDown from '../../utils/Slide';
// import { itemType } from '../../reducers/network';
import styles from './ContentPage.css';
import LoadButton from '../LoadButton/LoadButton';
import Link from '../Link/Link';

type Props = {
  fetchHome: (page: number, category: string) => void,
  fetchDetail: (category: string, id: string) => void,
  saveCategoryOffset: (category: string, page: number) => void,
  data: {},
  category: string,
};

class ContentPage extends Component<Props> {
  constructor() {
    super();
    this.state = { showSnack: false, message: '' };
  }

  componentWillMount() {
    this.fetchData();
  }

  componentDidMount() {
    this.applyOffset();
    if (this.container) {
      this.container.addEventListener('scroll', this.onScrollHandle.bind(this));
    }
  }

  componentWillUnmount() {
    this.updateOffsetData();
    if (this.container) {
      this.container.removeEventListener(
        'scroll',
        this.onScrollHandle.bind(this),
      );
    }
  }

  onScrollHandle(event) {
    const { clientHeight, scrollHeight, scrollTop } = event.target;
    const isBottom = clientHeight + scrollTop >= scrollHeight - 40;
    if (this.isScrollBottom !== isBottom) {
      this.isScrollBottom = isBottom;
      if (isBottom && !this.isLoad) {
        this.page = this.page + 1;
        this.fetchData();
      }
    }
  }

  page = 1;
  container = null;
  isLoad = false;
  hasData = false;
  isScrollBottom = false;

  applyOffset() {
    if (this.hasData) {
      const category = this.props.data[this.props.category];
      if (category.offset !== undefined) {
        this.container.scrollTop = category.offset;
      } else {
        this.container.scrollTop = 0;
      }
    }
  }

  updateOffsetData() {
    const category = this.props.data[this.props.category];
    if (this.hasData && category !== undefined) {
      if (category.offset === undefined) {
        category.offset = 0;
      }
      if (this.container.scrollTop !== category.offset) {
        this.props.saveCategoryOffset(
          this.props.category,
          this.container.scrollTop,
        );
      }
    }
  }

  fetchData() {
    this.isLoad = true;
    this.props.fetchHome(this.page, this.props.category);
  }

  showSnack(item) {
    let str = '';
    if (item.detail.magnent.length > 0) {
      item.detail.magnent.forEach(it => {
        str += `${it}\n`;
      });
      // clipboard.writeText(str);
      copy(str);
      str += '  已成功复制';
    } else {
      str = '没有找到磁力链';
    }
    this.setState({
      showSnack: true,
      message: str,
    });
    setTimeout(() => {
      this.setState({
        showSnack: false,
        message: '',
      });
    }, 1500);
  }

  renderArticalContent(item) {
    return (
      <div className={styles.itemContent} style={{ margin: 0 }}>
        <div className={styles.tags}>
          {item.tags.map(it => (
            <div key={it} className={styles.tag}>
              <span>{it}</span>
            </div>
          ))}
        </div>
        <div className={styles.articalTitle}>
          {item.author} · {item.date}
        </div>
        <div
          className={styles.articalCaption}
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      </div>
    );
  }

  renderImageContent(item) {
    return (
      <div className={styles.itemContent} style={{ margin: 0 }}>
        <div className={styles.tags}>
          {item.tags.map(it => (
            <div key={it} className={styles.tag}>
              <span>{it}</span>
            </div>
          ))}
        </div>
        <div className={styles.title}>
          {item.author} · {item.date}
        </div>
        <div className={styles.content}>{item.title}</div>
        <div
          className={styles.caption}
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      </div>
    );
  }

  renderList(categoryItem) {
    if (categoryItem.page === this.page) {
      this.isLoad = false;
    }
    return (
      <List style={{ maxWidth: 800, margin: 'auto' }}>
        {categoryItem.allIds.map(itemId => {
          const item = categoryItem.byId[itemId];
          return (
            <div className={styles.item} key={itemId} style={{ margin: 0 }}>
              <img
                alt=""
                className={styles.image}
                src={item.image}
                width="100%"
              />
              <span
                className={styles.cover}
                style={{
                  backgroundColor: 'rgba(0,0,0,.5)',
                  backgroundSize: '100%',
                }}
              />
              {item.image === ''
                ? this.renderArticalContent(item)
                : this.renderImageContent(item)}
              <Link
                className={styles.navLink}
                to={`/detail/${this.props.category}/${itemId}`}
              />
              <LoadButton
                item={item}
                category={this.props.category}
                fetchDetail={this.props.fetchDetail}
                showSnack={() => this.showSnack(item)}
              />
            </div>
          );
        })}
        <div className={styles.bottomProgress}>
          <CircularProgress
            style={{ color: 'white' }}
            thickness={4}
            size={30}
          />
        </div>
      </List>
    );
  }

  render() {
    const { data } = this.props;
    const categoryItem = data[this.props.category];

    this.hasData = categoryItem !== undefined;
    return (
      <div
        id="container"
        ref={c => {
          this.container = c;
        }}
        className={styles.container}
      >
        {categoryItem === undefined ? (
          <div className={styles.progressContainer}>
            <CircularProgress style={{ color: 'white' }} thickness={7} />
          </div>
        ) : (
          this.renderList(categoryItem)
        )}
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={this.state.showSnack}
          transition={TransitionDown}
          message={<span>{this.state.message}</span>}
        />
      </div>
    );
  }
}

export default withStyles(styles)(ContentPage);
