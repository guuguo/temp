// @flow
// import { withStyles } from 'material-ui/styles';
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import ContentPage from '../../components/ContentPage/ContentPage';
import classes from './ShrineTabsPage.css';

export const categories = {
  anime: '动画',
  age: '文章',
  comic: '漫画',
  game: '游戏',
  op: '音乐',
  book: '轻小说',
};

type shrineTabsProps = {
  fetchHome: (page, category) => void,
  addData: () => void,
  saveCategoryState: () => void,
  saveCategoryOffset: () => void,
  fetchDetail: () => void,
  data: {},
  history: {},
};

class ShrineTabsPage extends React.Component<shrineTabsProps> {
  constructor() {
    super();
    this.state = { categories: {} };
  }

  componentWillMount() {
    setTimeout(() => {
      this.setState({ categories });
    }, 100);
  }

  handleChange = (event, value) => {
    this.props.saveCategoryState(value);
  };

  render() {
    const { data } = this.props;
    let { currentCategory } = data;
    if (currentCategory === undefined) {
      currentCategory = 0;
    }
    if (Object.keys(this.state.categories).length > 0)
      return (
        <div className={classes.root}>
          <AppBar className={classes.header} position="static" color="default">
            <Tabs
              value={currentCategory}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              {Object.keys(this.state.categories).map(it => (
                <Tab
                  key={`t${it}`}
                  style={{ widthsaveCategoryStatesaveCategoryState: 100 }}
                  label={this.state.categories[it]}
                />
              ))}
            </Tabs>
          </AppBar>
          <div className={classes.content}>
            <ContentPage
              key={currentCategory}
              fetchHome={this.props.fetchHome}
              addData={this.props.addData}
              category={Object.keys(this.state.categories)[currentCategory]}
              saveCategoryOffset={this.props.saveCategoryOffset}
              fetchDetail={this.props.fetchDetail}
              history={this.props.history}
              data={this.props.data}
            />
          </div>
        </div>
      );
    return <div />;
  }
}

export default withStyles(classes)(ShrineTabsPage);
