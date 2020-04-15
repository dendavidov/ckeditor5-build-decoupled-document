/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import { findOptimalInsertionPosition } from '@ckeditor/ckeditor5-widget/src/utils';

/**
 * @module image/image/imageinsertcommand
 */

/**
 * Insert image command.
 *
 * The command is registered by the {@link module:image/image/imageediting~ImageEditing} plugin as `'imageInsert'`.
 *
 * In order to insert an image at the current selection position
 * (according to the {@link module:widget/utils~findOptimalInsertionPosition} algorithm),
 * execute the command and specify the image source:
 *
 *		editor.execute( 'imageInsert', { source: 'http://url.to.the/image' } );
 *
 * It is also possible to insert multiple images at once:
 *
 *		editor.execute( 'imageInsert', {
 *			source:  [
 *				'path/to/image.jpg',
 *				'path/to/other-image.jpg'
 *			]
 *		} );
 *
 * @extends module:core/command~Command
 */


export function insertVideo( writer, model, attributes = {} ) {
	const videoElement = writer.createElement( 'video', attributes );

	const insertAtSelection = findOptimalInsertionPosition( model.document.selection, model );

	model.insertContent( videoElement, insertAtSelection );

	// Inserting an image might've failed due to schema regulations.
	if ( videoElement.parent ) {
		writer.setSelection( videoElement, 'on' );
	}
}

export default class VideoInsertCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		this.isEnabled = true;
	}

	/**
	 * Executes the command.
	 *
	 * @fires execute
	 * @param {Object} options Options for the executed command.
	 * @param {String|Array.<String>} options.source The image source or an array of image sources to insert.
	 */
	execute( options ) {
		const model = this.editor.model;

		model.change( writer => {
			const sources = Array.isArray( options.source ) ? options.source : [ options.source ];

			for ( const src of sources ) {
				insertVideo( writer, model, { src, controls: true } );
			}
		} );
	}
}
