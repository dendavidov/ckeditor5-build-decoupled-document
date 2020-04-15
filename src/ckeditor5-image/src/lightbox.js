/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImageLightboxEditing from './lightbox/imagelightboxediting';
import ImageLightboxUI from './lightbox/imagelightboxui';

export default class LightBox extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ImageLightboxEditing, ImageLightboxUI];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'LightBox';
    }
}
