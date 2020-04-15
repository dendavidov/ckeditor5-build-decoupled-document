import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import * as videoIcon from './video-icon.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import first from '@ckeditor/ckeditor5-utils/src/first';
import VideoInsertCommand from './videoinsertcommand';

export function createVideoViewElement(writer) {
    const emptyElement = writer.createEmptyElement('video');
    const figure = writer.createContainerElement('figure', { class: 'video' });

    writer.insert(writer.createPositionAt(figure, 0), emptyElement);

    return figure;
}

export function viewFigureToModel() {
    return dispatcher => {
        dispatcher.on('element:figure', converter);
    };

    function converter(evt, data, conversionApi) {
        // Do not convert if this is not an "image figure".
        if (
            !conversionApi.consumable.test(data.viewItem, {
                name: true,
                classes: 'video',
            })
        ) {
            return;
        }

        // Find an image element inside the figure element.
        const viewVideo = Array.from(
            data.viewItem.getChildren(),
        ).find(viewChild => viewChild.is('video'));

        // Do not convert if image element is absent, is missing src attribute or was already converted.
        if (
            !viewVideo ||
            !viewVideo.hasAttribute('src') ||
            !conversionApi.consumable.test(viewVideo, { name: true })
        ) {
            return;
        }

        // Convert view image to model image.
        const conversionResult = conversionApi.convertItem(
            viewVideo,
            data.modelCursor,
        );

        // Get image element from conversion result.
        const modelVideo = first(conversionResult.modelRange.getItems());

        // When image wasn't successfully converted then finish conversion.
        if (!modelVideo) {
            return;
        }

        // Convert rest of the figure element's children as an image children.
        conversionApi.convertChildren(
            data.viewItem,
            conversionApi.writer.createPositionAt(modelVideo, 0),
        );

        // Set image range as conversion result.
        data.modelRange = conversionResult.modelRange;

        // Continue conversion where image conversion ends.
        data.modelCursor = conversionResult.modelCursor;
    }
}

export function toImageWidget(viewElement, writer, label) {
    writer.setCustomProperty('video', true, viewElement);

    return toWidget(viewElement, writer, { label: labelCreator });

    function labelCreator() {
        const imgElement = viewElement.getChild(0);
        const altText = imgElement.getAttribute('alt');

        return altText ? `${altText} ${label}` : label;
    }
}

export function modelToViewAttributeConverter(attributeKey) {
    return dispatcher => {
        dispatcher.on(`attribute:${attributeKey}:video`, converter);
    };

    function converter(evt, data, conversionApi) {
        if (!conversionApi.consumable.consume(data.item, evt.name)) {
            return;
        }

        const viewWriter = conversionApi.writer;
        const figure = conversionApi.mapper.toViewElement(data.item);
        const video = figure.getChild(0);

        if (data.attributeNewValue !== null) {
            viewWriter.setAttribute(
                data.attributeKey,
                data.attributeNewValue,
                video,
            );
        } else {
            viewWriter.removeAttribute(data.attributeKey, video);
        }
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

export default class VideoUploadButton extends Plugin {
    init() {
        const editor = this.editor;
        const schema = editor.model.schema;
        const t = editor.t;
        const conversion = editor.conversion;

        editor.ui.componentFactory.add('video-upload', locale => {
            const view = new ButtonView(locale);

            schema.register('video', {
                isObject: true,
                isBlock: true,
                allowWhere: '$block',
                allowAttributes: ['src', 'controls', 'width'],
            });
            conversion.for('dataDowncast').elementToElement({
                model: 'video',
                view: (modelElement, viewWriter) =>
                    createVideoViewElement(viewWriter),
            });
            conversion.for('editingDowncast').elementToElement({
                model: 'video',
                view: (modelElement, viewWriter) =>
                    toImageWidget(
                        createVideoViewElement(viewWriter),
                        viewWriter,
                        t('video widget'),
                    ),
            });

            conversion
                .for('downcast')
                .add(modelToViewAttributeConverter('src'))
                .add(modelToViewAttributeConverter('controls'));

            conversion
                .for('upcast')
                .elementToElement({
                    view: {
                        name: 'video',
                        attributes: {
                            src: true,
                            controls: true,
                        },
                    },
                    model: (viewVideo, modelWriter) =>
                        modelWriter.createElement('video', {
                            src: viewVideo.getAttribute('src'),
                            controls: viewVideo.getAttribute('controls'),
                        }),
                })
                .add(viewFigureToModel());

            editor.commands.add('videoInsert', new VideoInsertCommand(editor));

            view.set({
                label: 'Upload video',
                icon: videoIcon,
                tooltip: true,
            });

            const {
                downloadUrl,
                uploadUrl,
                getHeaders,
                onError,
                onStart,
                onSuccess,
            } = editor.config.get('ckfinder');

            const cb = files => {
                onStart();

                if (!files[0]) {
                    return;
                }

                const { name, size, lastModified, type } = files[0];

                const key = `${hashCode(
                    [name, size, lastModified, type].join('-'),
                )}-${name}`;

                fetch(uploadUrl, {
                    body: JSON.stringify({ key }),
                    headers: {
                        'Content-Type': 'application/json',
                        ...getHeaders(),
                    },
                    method: 'POST',
                })
                    .then(res => res.json())
                    .then(data => data.data)
                    .then(url =>
                        fetch(url, {
                            method: 'PUT',
                            body: files[0],
                        }),
                    )
                    .then(() => {
                        editor.execute('videoInsert', {
                            source: `${downloadUrl}/${key}`,
                            controls: true,
                        });
                        onSuccess();
                    })
                    .catch(error => onError(error));
            };

            this.inp = window.document.createElement('input');
            this.inp.setAttribute('type', 'file');
            this.inp.setAttribute('accept', '.mp4, .x-m4v, video/*');
            this.inp.addEventListener('change', e => {
                if (!e.target || !e.target.files || !e.target.files[0]) {
                    return;
                }
                cb(e.target.files);
            });

            // Callback executed once the image is clicked.
            view.on('execute', () => {
                this.inp.click();
            });

            return view;
        });
    }
}
