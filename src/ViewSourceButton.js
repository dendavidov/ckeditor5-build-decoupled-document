import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import imageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class ViewSourceButton extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'source-button', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: 'View source',
				icon: imageIcon,
				tooltip: true
			} );

			// Callback executed once the image is clicked.
			view.on( 'execute', () => {
				console.log('IT WORKS');
			} );

			return view;
		} );
	}
}
q
