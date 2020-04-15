/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module easy-image/easyimage
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import CloudServicesUploadAdapter from './cloudservicesuploadadapter';

// eslint-disable-next-line
import Image from '../../ckeditor5-image/src/image';
// eslint-disable-next-line
import ImageUpload from '../../ckeditor5-image/src/imageupload';

export default class EasyImage extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [CloudServicesUploadAdapter, Image, ImageUpload];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'EasyImage';
    }
}
