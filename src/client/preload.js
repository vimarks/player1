/**
 * Instructs the browser to load the asset file immeditely on page load.
 *
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content
 */
export default function preload(assetFile, as) {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = assetFile
  link.as = as
  document.head.appendChild(link)
  return assetFile
}
