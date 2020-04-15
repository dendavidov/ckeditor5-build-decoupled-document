import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import * as codeIcon from './code-solid.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class ViewSourceButton extends Plugin {
    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add('source-button', locale => {
            const view = new ButtonView(locale);

            view.set({
                label: 'Source Code',
                icon: codeIcon,
                tooltip: true,
            });

            // Callback executed once the image is clicked.
            view.on('execute', () => {
                const { handler } = editor.config.get('sourceCode');

                if (typeof handler === 'function') {
                    handler();
                }
            });

            return view;
        });
    }
}
