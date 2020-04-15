/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import SwitchButtonView from '@ckeditor/ckeditor5-ui/src/button/switchbuttonview';

import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';

/**
 * The image text alternative UI plugin.
 *
 * The plugin uses the {@link module:ui/panel/balloon/contextualballoon~ContextualBalloon}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ImageLightboxUI extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [ContextualBalloon];
    }

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'ImageLightboxUI';
    }

    /**
     * @inheritDoc
     */
    init() {
        this._createButton();
    }

    /**
     * @inheritDoc
     */
    destroy() {
        super.destroy();
    }

    /**
     * @private
     */
    _createButton() {
        const editor = this.editor;

        editor.ui.componentFactory.add('lightBox', locale => {
            const command = editor.commands.get('lightBox');
            const switchButton = new SwitchButtonView(locale);

            switchButton.set({
                withText: true,
                label: 'Use Lightbox',
            });

            switchButton.bind('isEnabled').to(command, 'isEnabled');
            switchButton.bind('isOn').to(command, 'value');

            this.listenTo(switchButton, 'execute', () => {
                editor.execute('lightBox', {
                    newValue: switchButton.isOn ? '' : 'on',
                });
            });

            return switchButton;
        });
    }
}
