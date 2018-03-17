/* eslint-disable class-methods-use-this */
// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ArrowBack from 'material-ui-icons/ArrowBack';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { CircularProgress } from 'material-ui/Progress';
import Card, { CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import copy from 'copy-to-clipboard';
import TransitionDown from '../../utils/Slide';
import styles from './DetailPage.css';
import * as NetworkActions from '../../actions/network';
import Link from '../../components/Link/Link';

type Props = {
  fetchDetail: (category: string, id: string) => void,
  data: {},
  params: { id: string, category: string },
};

class DetailPage extends Component<Props> {
  static handleOpenClick(url) {
    window.open(url);
  }

  constructor() {
    super();
    this.state = { showSnack: false, message: '' };
  }

  componentWillMount() {
    const { id, category } = this.props.params;
    if (this.props.data[category].byId[id].detail === undefined) {
      this.props.fetchDetail(category, id);
    }
  }

  handleCopyClick(magnent) {
    copy(magnent);
    this.setState({ showSnack: true, message: `${magnent} 已复制到剪贴板` });
    setTimeout(() => this.setState({ showSnack: false }), 1000);
  }

  renderContent(item) {
    return (
      <div>
        {item.detail.magnent.map(it => this.renderLinkContent(it))}
        {item.detail.baidupan.map(it => this.renderLinkContent(it, false))}
        <div
          className={styles.contentCard}
          dangerouslySetInnerHTML={{ __html: item.detail.content }}
        />
      </div>
    );
  }

  renderLinkContent(str, isCopy = true) {
    return str !== '' ? (
      <Card className={styles.card}>
        <CardContent className={styles.magnentContent}>
          {str}
          <Button
            color="primary"
            onClick={() =>
              isCopy ? this.handleCopyClick(str) : this.handleOpenClick(str)
            }
          >
            {isCopy ? '复制' : '打开'}
          </Button>
        </CardContent>
      </Card>
    ) : (
      <div />
    );
  }

  render() {
    const { id, category } = this.props.params;
    const item = this.props.data[category].byId[id];
    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Link to="/">
              <IconButton aria-label="Menu">
                <ArrowBack />
              </IconButton>
            </Link>
            <Typography variant="title" color="inherit">
              {item.title}
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={styles.content}>
          {item.detail === undefined ? (
            <div className={styles.progressContainer}>
              <CircularProgress style={{ color: 'white' }} thickness={7} />
            </div>
          ) : (
            this.renderContent(item)
          )}
        </div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={this.state.showSnack}
          onClose={this.handleClose}
          transition={TransitionDown}
          message={<span>{this.state.message}</span>}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.shrineData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(NetworkActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(DetailPage),
);
