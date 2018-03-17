// @flow
import React, { Component } from 'react';
import Button from 'material-ui/Button';
import LinkIcon from 'material-ui-icons/Link';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { CircularProgress } from 'material-ui/Progress';
import styles from './LoadButton.css';

type Props = {
  category: string,
  fetchDetail: () => void,
  showSnack: () => void,
  item: {},
};

class LoadButton extends Component<Props> {
  constructor() {
    super();
    this.state = {
      isLoad: false,
    };
  }

  handleUrlButtonClick(item) {
    const { category, fetchDetail } = this.props;
    if (item.detail === undefined) {
      this.setState({
        isLoad: true,
      });
      fetchDetail(category, item.id);
    } else {
      this.props.showSnack(item);
    }
  }

  render() {
    const { item } = this.props;
    const isDetail = item.detail !== undefined;
    if (isDetail && this.state.isLoad) {
      this.state.isLoad = false;
      this.props.showSnack(item);
    }
    return (
      <div className={styles.iconButton}>
        <Button
          className={styles.absolute}
          variant="fab"
          style={{ color: isDetail ? 'blue' : 'gray' }}
          color="inherit"
          onClick={() => this.handleUrlButtonClick(item)}
        >
          <LinkIcon />
        </Button>
        {this.state.isLoad ? (
          <CircularProgress className={styles.absolute} size={54} />
        ) : (
          <span />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(LoadButton);
