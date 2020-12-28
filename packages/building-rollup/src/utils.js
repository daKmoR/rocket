import path from 'path';

export function injectServiceWorker(swDest, outputDir) {
  return (html, { htmlFileName }) => {
    let swPath = swDest.replace(`${outputDir}/`, '');
    swPath = path.relative(path.dirname(htmlFileName), swPath);
    const insert = `
      <script inject-service-worker>
        if ('serviceWorker' in navigator) {
          window.addEventListener('load', function() {
            navigator.serviceWorker
              .register('${swPath}')
              .then(function() {
                console.log('ServiceWorker registered.');
              })
              .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
              });
          });
        }
      </script>
    `;
    return html.replace('</body>', `${insert}</body>`);
  };
}
