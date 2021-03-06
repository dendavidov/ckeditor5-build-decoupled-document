/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import DecoupledEditorBase from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor';
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize';
import FontFamily from '@ckeditor/ckeditor5-font/src/fontfamily';
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';

import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import EasyImage from './ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from './ckeditor5-image/src/image';
import ImageCaption from './ckeditor5-image/src/imagecaption';
import ImageStyle from './ckeditor5-image/src/imagestyle';
import ImageToolbar from './ckeditor5-image/src/imagetoolbar';
import ImageUpload from './ckeditor5-image/src/imageupload';
import ImageResize from './ckeditor5-image/src/imageresize';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import ViewSourceButton from './ViewSourceButton';
import VideoUploadButton from './VideoUploadButton';

import UploadAdapter from './uploadapter/uploadadapter';
import CKFinder from './ckeditor5-ckfinder/src/ckfinder';
import VideoResize from './videoresize';
import { colorsSettings } from './colors';

export default class DecoupledEditor extends DecoupledEditorBase {}

// Plugins to include in the build.
DecoupledEditor.builtinPlugins = [
    Essentials,
    Alignment,
    FontSize,
    FontFamily,
    FontColor,
    FontBackgroundColor,
    Highlight,
    UploadAdapter,
    Autoformat,
    Bold,
    Italic,
    Strikethrough,
    Underline,
    BlockQuote,
    CKFinder,
    EasyImage,
    Heading,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    ImageResize,
    Link,
    List,
    MediaEmbed,
    Paragraph,
    PasteFromOffice,
    Table,
    TableToolbar,
    VideoUploadButton,
    ViewSourceButton,
    VideoResize,
];

// Editor configuration.
DecoupledEditor.defaultConfig = {
    toolbar: {
        items: [
            'heading',
            '|',
            'fontsize',
            'fontfamily',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'fontColor',
            'fontBackgroundColor',
            '|',
            'alignment',
            '|',
            'numberedList',
            'bulletedList',
            '|',
            'link',
            'blockquote',
            'video-upload',
            'imageUpload',
            'insertTable',
            'mediaEmbed',
            '|',
            'undo',
            'redo',
            '|',
            'source-button',
        ],
    },
    image: {
        styles: ['full', 'side', 'alignLeft', 'alignCenter', 'alignRight'],
        resizeUnit: 'px',
        toolbar: [
            'imageStyle:alignLeft',
            'imageStyle:full',
            'imageStyle:alignRight',
            '|',
            'imageTextAlternative',
            '|',
            'lightBox',
        ],
    },
    table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
    },
    link: {
        decorators: {
            addTargetToLinks: {
                mode: 'manual',
                label: 'Open in a new tab',
                attributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
            },
        },
    },
    fontColor: {
        colors: colorsSettings,
        columns: 17,
    },
    fontBackgroundColor: {
        colors: colorsSettings,
        columns: 17,
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: 'en',
};
