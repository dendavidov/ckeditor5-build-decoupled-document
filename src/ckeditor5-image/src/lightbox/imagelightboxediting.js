/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import ImageLightboxCommand from './imagelightboxcommand';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class ImageLightboxEditing extends Plugin {
    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'ImageLightboxEditing';
    }

    /**
     * @inheritDoc
     */
    init() {
        this.editor.commands.add(
            'lightBox',
            new ImageLightboxCommand(this.editor),
        );
    }
}
