/*
_config.yml
pretty_urls:
  trailing_index: false # Set to false to remove trailing 'index.html' from permalinks
  trailing_html: false # Set to false to remove trailing '.html' from permalinks
*/

'use strict';
var cheerio = require('cheerio');

hexo.extend.filter.register('after_post_render', function(data){
  const { config } = hexo;
  if(config.post_asset_folder){
    // relative link between root and index.html
    const link = data.permalink.replace(new RegExp(`^${config.url}/|(index\.html)?$`, 'ig'), "");

    ['excerpt', 'more', 'content'].forEach((key) => {
      const $ = cheerio.load(data[key], {
        ignoreWhitespace: false,
        xmlMode: false,
        lowerCaseTags: false,
        decodeEntities: false
      });

      $('img').each(function(){
        ['src', 'data-src'].forEach((srcAttr) => {
          if(!$(this).attr(srcAttr)) return
          let src = $(this).attr(srcAttr).replace('\\', '/').trim();
          // skip http url
          if(/^(https?:)?\/\//.test(src)) return
          // replace ../ to config.root
          if(/^\.\.\//.test(src)) src = src.replace(/^\.\.\//, config.root);
          else {
            // change post_title/asset.img to absolute_path/asset.img
            var srcArray = src.split('/').filter((elem) => elem && elem != '.');
            if(srcArray.length > 1) srcArray = srcArray[srcArray.length - 1];
            src = config.root + link + srcArray;
          }
          $(this).attr(srcAttr, src);
          console.debug&&console.debug(`update ${srcAttr} link to:${$(this).attr(srcAttr)}`);
        })
      });
      data[key] = $.html();
    });

  }
});