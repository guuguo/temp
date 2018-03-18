import axios from 'axios';
import config from '../config';

export const ADD_DATA = 'ADD_DATA';
export const ADD_DETAIL = 'ADD_DETAIL';
export const SAVE_CATEGORY_STATE = 'SAVE_CATEGORY_STATE';
export const SAVE_CATEGORY_OFFSET = 'SAVE_CATEGORY_OFFSET';

export function addData(items, category, page) {
  return {
    type: ADD_DATA,
    items,
    category,
    page,
  };
}

export function addDetail(detail, category, id) {
  return {
    type: ADD_DETAIL,
    detail,
    category,
    id,
  };
}

export function saveCategoryState(categoryIndex) {
  return {
    type: SAVE_CATEGORY_STATE,
    categoryIndex,
  };
}

export function saveCategoryOffset(category, offset) {
  return {
    type: SAVE_CATEGORY_OFFSET,
    category,
    offset,
  };
}

const regexMagnent = new RegExp(
  '[^0-9a-zA-Z/]([0-9a-zA-Z]{40}|[0-9a-zA-Z]{32})(?![0-9a-zA-Z.]+)',
  'g',
);

const regexPan = /\bs\/[0-9a-zA-Z]{8}\b/;

function resolveDetailData(res) {
  const el = document.createElement('html');
  el.innerHTML = res;
  const articalE = el.getElementsByClassName('entry-content')[0];
  const magMatch = articalE.innerHTML
    .replace('保护作者版权 本站不提供下载', '')
    .match(regexMagnent);
  const panMatch = articalE.innerHTML.match(regexPan);
  let magnent;
  if (magMatch === undefined || magMatch === null) magnent = [];
  else
    magnent = magMatch.map(
      it => `magnet:?xt=urn:btih:${it.substr(1, it.length - 1)}`,
    );

  let baidupan;
  if (panMatch === undefined || panMatch === null) baidupan = [];
  else baidupan = panMatch.map(it => `https://pan.baidu.com/${it}`);

  return {
    content: articalE.innerHTML,
    magnent,
    baidupan,
  };
}

const getContent = node => {
  try {
    node.removeChild(node.getElementsByTagName('img')[0]);
    node.removeChild(node.getElementsByTagName('a')[0]);
  } catch (e) {
    // empty}
  }
  return node;
};

function resolveShrineData(res, category) {
  switch (category) {
    default: {
      const el = document.createElement('html');
      el.innerHTML = res;

      return Array.from(el.getElementsByTagName('article')).map(articalE => {
        const id = articalE.id.replace('post-', '');
        const title = articalE
          .getElementsByClassName('entry-title')[0]
          .getElementsByTagName('a')[0].innerText;
        const date = articalE
          .getElementsByClassName('entry-date')[0]
          .getAttribute('datetime');
        const author = articalE
          .getElementsByClassName('by-author')[0]
          .getElementsByTagName('a')[0].innerText;
        let tags;
        try {
          tags = Array.from(
            articalE
              .getElementsByClassName('tag-links')[0]
              .getElementsByTagName('a'),
          ).map(it => it.innerHTML);
        } catch (e) {
          tags = [];
        }
        let image;
        try {
          image = articalE
            .getElementsByClassName('entry-content')[0]
            .getElementsByTagName('p')[0]
            .getElementsByTagName('img')[0].src;
        } catch (e) {
          image = '';
        }
        const content = getContent(
          articalE
            .getElementsByClassName('entry-content')[0]
            .getElementsByTagName('p')[0],
        ).innerHTML;
        return {
          id,
          title,
          date,
          author,
          tags,
          image,
          content,
        };
      });
    }
  }
}
const IP_ADDRESS = `http://${config.ip}/api`;

export function fetchHome(page, category) {
  return dispatch => {
    axios
      .get(`${IP_ADDRESS}/wp/${category}.html/page/${page}`)
      .then(response => {
        dispatch(
          addData(resolveShrineData(response.data, category), category, page),
        );
        return 0;
      })
      .catch(() => {
        // empty
      });
  };
}

export function fetchDetail(category, id) {
  return dispatch => {
    axios
      .get(`${IP_ADDRESS}/wp/${id}.html`)
      .then(response => {
        dispatch(addDetail(resolveDetailData(response.data), category, id));
        return 0;
      })
      .catch(() => {
        // empty
      });
  };
}
