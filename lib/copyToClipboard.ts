export default function copyToClipboard(text: string, successCallback?: () => void, errCallback?: () => void) {
  navigator.clipboard.writeText(text).then(function() {
    successCallback && successCallback();
  }, function() {
    errCallback && errCallback();
  });
}
