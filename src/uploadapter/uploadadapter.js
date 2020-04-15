/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* globals XMLHttpRequest, FormData */

/**
 * @module adapter-ckfinder/uploadadapter
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';
import { getCsrfToken } from './utils';

/**
 * A plugin that enables file uploads in CKEditor 5 using the CKFinder server–side connector.
 *
 * See the {@glink features/image-upload/ckfinder "CKFinder file manager integration" guide} to learn how to configure
 * and use this feature as well as find out more about the full integration with the file manager
 * provided by the {@link module:ckfinder/ckfinder~CKFinder} plugin.
 *
 * Check out the {@glink features/image-upload/image-upload comprehensive "Image upload overview"} to learn about
 * other ways to upload images into CKEditor 5.
 *
 * @extends module:core/plugin~Plugin
 */
export default class CKFinderUploadAdapter extends Plugin {
    /**
     * @inheritDoc
     */
    static get requires() {
        return [FileRepository];
    }

    /**
	 * @inheritDoc
	 *
	static get pluginName() {
		return 'CKFinderUploadAdapterNew';
	}

	/**
	 * @inheritDoc
	 */
    init() {
        const {
            uploadUrl,
            getHeaders,
            downloadUrl,
            onError,
            onStart,
            onSuccess,
        } = this.editor.config.get('ckfinder');

        if (!uploadUrl) {
            return;
        }

        // Register CKFinderAdapter
        this.editor.plugins.get(FileRepository).createUploadAdapter = loader =>
            new UploadAdapter({
                loader,
                uploadUrl,
                t: this.editor.t,
                getHeaders,
                downloadUrl,
                onError,
                onStart,
                onSuccess,
            });
    }
}

function hashCode(str) {
    return str
        .split('')
        .reduce(
            (prevHash, currVal) =>
                ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
            0,
        );
}

/**
 * Upload adapter for CKFinder.
 *
 * @private
 * @implements module:upload/filerepository~UploadAdapter
 */
class UploadAdapter {
    /**
     * Creates a new adapter instance.
     *
     * @param {module:upload/filerepository~FileLoader} loader
     * @param {String} url
     * @param {module:utils/locale~Locale#t} t
     */
    constructor({
        loader,
        downloadUrl,
        uploadUrl,
        t,
        getHeaders,
        onError,
        onStart,
        onSuccess,
    }) {
        /**
         * FileLoader instance to use during the upload.
         *
         * @member {module:upload/filerepository~FileLoader} #loader
         */
        this.loader = loader;

        /**
         * Upload URL.
         *
         * @member {String} #url
         */
        this.url = null;
        this.downloadUrl = downloadUrl;
        this.uploadUrl = uploadUrl;

        /**
         * Locale translation method.
         *
         * @member {module:utils/locale~Locale#t} #t
         */
        this.t = t;
        this.getHeaders = getHeaders;
        this.onError = onError;
        this.onStart = onStart;
        this.onSuccess = onSuccess;
    }

    /**
     * Starts the upload process.
     *
     * @see module:upload/filerepository~UploadAdapter#upload
     * @returns {Promise.<Object>}
     */
    upload() {
        return this.loader.file.then(file => {
            const { name, size, lastModified, type } = file;

            const key = `${hashCode(
                [name, size, lastModified, type].join('-'),
            )}-${name}`;

            // eslint-disable-next-line no-undef
            return fetch(this.uploadUrl, {
                body: JSON.stringify({ key }),
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getHeaders(),
                },
                method: 'POST',
            })
                .then(res => res.json())
                .then(data => {
                    // eslint-disable-next-line no-undef
                    return fetch(data.data, {
                        method: 'PUT',
                        body: file,
                    });
                })
                .then(() => {
                    return { default: `${this.downloadUrl}/${key}` };
                });
        });
    }

    /**
     * Aborts the upload process.
     *
     * @see module:upload/filerepository~UploadAdapter#abort
     */
    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }

    /**
     * Initializes the XMLHttpRequest object.
     *
     * @private
     */
    _initRequest() {
        const xhr = (this.xhr = new XMLHttpRequest());

        xhr.open('PUT', this.url, true);

        xhr.responseType = 'json';
    }

    /**
     * Initializes XMLHttpRequest listeners.
     *
     * @private
     * @param {Function} resolve Callback function to be called when the request is successful.
     * @param {Function} reject Callback function to be called when the request cannot be completed.
     * @param {File} file File instance to be uploaded.
     */
    _initListeners(resolve, reject, file, key) {
        const xhr = this.xhr;
        const loader = this.loader;
        const t = this.t;
        const genericError = t('Cannot upload file:') + ` ${file.name}.`;

        xhr.addEventListener('error', () => reject(genericError));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () => {
            const status = xhr.status;

            if (status !== 200) {
                return reject(genericError);
            }

            resolve({
                default: `${this.downloadUrl}/${key}`,
            });
        });

        // Upload progress when it's supported.
        /* istanbul ignore else */
        if (xhr.upload) {
            xhr.upload.addEventListener('progress', evt => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }

    /**
     * Prepares the data and sends the request.
     *
     * @private
     * @param {File} file File instance to be uploaded.
     */
    _sendRequest(file) {
        // Prepare form data.
        const data = new FormData();
        data.append('upload', file);
        data.append('ckCsrfToken', getCsrfToken());

        // Send request.
        this.xhr.send(data);
    }
}
