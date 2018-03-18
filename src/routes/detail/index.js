/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout/MyLayout';
import Detail from './DetailPage';

const title = '详细内容';

function action(c, params) {
  return {
    chunks: ['detail'],
    title,
    component: (
      <Layout>
        <Detail title={title} params={params} />
      </Layout>
    ),
  };
}

export default action;
