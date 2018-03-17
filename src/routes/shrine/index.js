/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import ShrinePage from './ShrinePage';
import Layout from '../../components/Layout/MyLayout';

function action() {
  return {
    chunks: ['shrine'],
    component: (
      <Layout>
        <ShrinePage />
      </Layout>
    ),
  };
}

export default action;
