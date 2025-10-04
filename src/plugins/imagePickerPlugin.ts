import { imagePickerPlugin as coreImagePickerPlugin, type ImagePickerOptions } from './imagePicker';

export function imagePickerPlugin(opts?: ImagePickerOptions) {
  return coreImagePickerPlugin({
    label: '🖼️',
    title: 'Insert image',
    ...opts,
  });
}
