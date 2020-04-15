/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* eslint-env node */

'use strict';

module.exports = {
    extends: 'ckeditor5',
    env: {
        browser: true,
    },
    rules: {
        indent: ['error', 4],
        'operator-linebreak': 0,
        'space-in-parens': 0,
        'array-bracket-spacing': ['error', 'never'],
        'computed-property-spacing': ['error', 'never'],
        'template-curly-spacing': ['error', 'never'],
    },
};
