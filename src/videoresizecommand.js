/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/imageresize/imageresizecommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';

/**
 * Checks if the provided model element is an `image`.
 *
 * @param {module:engine/model/element~Element} modelElement
 * @returns {Boolean}
 */
export function isVideo( modelElement ) {
	return !!modelElement && modelElement.is( 'video' );
}

/**
 * The image resize command. Currently, it supports only the width attribute.
 *
 * @extends module:core/command~Command
 */
export default class ImageResizeCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const element = this.editor.model.document.selection.getSelectedElement();

		this.isEnabled = isVideo( element );

		if ( !element || !element.hasAttribute( 'width' ) ) {
			this.value = null;
		} else {
			this.value = {
				width: element.getAttribute( 'width' ),
				height: null
			};
		}
	}

	/**
	 * Executes the command.
	 *
	 *		// Sets the width to 50%:
	 *		editor.execute( 'imageResize', { width: '50%' } );
	 *
	 *		// Removes the width attribute:
	 *		editor.execute( 'imageResize', { width: null } );
	 *
	 * @param {Object} options
	 * @param {String|null} options.width The new width of the image.
	 * @fires execute
	 */
	execute( options ) {
		const model = this.editor.model;
		const videoElement = model.document.selection.getSelectedElement();

		model.change( writer => {
			writer.setAttribute( 'width', options.width, videoElement );
		} );
	}
}
