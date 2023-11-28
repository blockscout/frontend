import type { OutputData } from '@editorjs/editorjs';
import type { IYMFTagNode } from '@ylide/sdk';
import { YMF, randomBytes } from '@ylide/sdk';
import { SmartBuffer } from '@ylide/smart-buffer';

export function htmlSelfClosingTagsToXHtml(html: string) {
  return html.replace(
    // eslint-disable-next-line regexp/no-super-linear-backtracking
    /<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr|command|keygen|menuitem|frame)\b(.*?)[ /]*>/,
    '<$1$2 />',
  );
}

const EMPTY_OUTPUT_DATA: OutputData = {
  time: 1676587472156,
  version: '2.26.5',
  blocks: [],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseEditorJsJson(json: any) {
  try {
    json = typeof json === 'string' ? JSON.parse(json) : json;
  } catch (e) {
    return typeof json === 'string' ? json : JSON.stringify(json);
  }
  let result = '';

  for (const block of json.blocks) {
    if (block.type === 'paragraph') {
      result += block.data.text + '\n';
    } else if (block.type === 'header') {
      result += '#'.repeat(block.data.level) + ' ' + block.data.text + '\n';
    } else if (block.type === 'list') {
      let i = 1;
      for (const item of block.data.items) {
        result += (block.data.style === 'ordered' ? `${ i }. ` : '- ') + item + '\n';
        i++;
      }
    } else if (block.type === 'delimiter') {
      result += '\n';
    } else if (block.type === 'image') {
      result += block.data.caption + '\n';
    } else if (block.type === 'embed') {
      result += block.data.caption + '\n';
    } else if (block.type === 'table') {
      result += block.data.caption + '\n';
    } else if (block.type === 'quote') {
      result += block.data.caption + '\n';
    } else if (block.type === 'code') {
      result += block.data.caption + '\n';
    } else if (block.type === 'raw') {
      result += block.data.caption + '\n';
    } else if (block.type === 'warning') {
      result += block.data.caption + '\n';
    } else if (block.type === 'linkTool') {
      result += block.data.caption + '\n';
    } else if (block.type === 'marker') {
      result += block.data.caption + '\n';
    } else if (block.type === 'checklist') {
      result += block.data.caption + '\n';
    } else if (block.type === 'inlineCode') {
      result += block.data.caption + '\n';
    } else if (block.type === 'simpleImage') {
      result += block.data.caption + '\n';
    } else if (block.type === 'underline') {
      result += block.data.caption + '\n';
    } else if (block.type === 'strikethrough') {
      result += block.data.caption + '\n';
    } else if (block.type === 'superscript') {
      result += block.data.caption + '\n';
    } else if (block.type === 'subscript') {
      result += block.data.caption + '\n';
    } else if (block.type === 'link') {
      result += block.data.caption + '\n';
    } else if (block.type === 'alignment') {
      result += block.data.caption + '\n';
    } else if (block.type === 'rawTool') {
      result += block.data.caption + '\n';
    } else if (block.type === 'del') {
      result += block.data.caption + '\n';
    } else if (block.type === 'inlineLink') {
      result += block.data.caption + '\n';
    } else if (block.type === 'mention') {
      result += block.data.caption + '\n';
    }
  }

  return result.replaceAll('<br>', '\n');
}

export function editorJsToYMF(data: OutputData | undefined) {
  if (!data) {
    return YMF.fromPlainText('');
  }

  const prepareText = (text: string) => htmlSelfClosingTagsToXHtml(text);

  const nodes: Array<string> = [];
  for (const block of data.blocks) {
    if (block.type === 'paragraph') {
      nodes.push(`<p ejs-id="${ block.id }">${ prepareText(block.data.text) }</p>`); // data.text
    } else if (block.type === 'header') {
      // data.level -- number
      // data.text -- string
      nodes.push(
        `<h${ block.data.level } ejs-id="${ block.id }">${ prepareText(block.data.text) }</h${ block.data.level }>`,
      );
    } else if (block.type === 'list') {
      // data.style: 'ordered' | 'unordered'
      // data.items: string[]
      if (block.data.style === 'ordered') {
        const innerNodes: Array<string> = [];
        for (let i = 0; i < block.data.items.length; i++) {
          innerNodes.push(`<li><ejs-bullet>${ i + 1 }. </ejs-bullet>${ prepareText(block.data.items[i]) }</li>`);
        }
        nodes.push(`<ol ejs-id="${ block.id }">${ innerNodes.join('\n') }</ol>`);
      } else if (block.data.style === 'unordered') {
        const innerNodes: Array<string> = [];
        for (let i = 0; i < block.data.items.length; i++) {
          innerNodes.push(`<li><ejs-bullet>• </ejs-bullet>${ prepareText(block.data.items[i]) }</li>`);
        }
        nodes.push(`<ul ejs-id="${ block.id }">${ innerNodes.join('\n') }</ul>`);
      }
    } else {
      // nothing
    }
  }

  return YMF.fromYMFText(`<editorjs>${ nodes.join('\n') }</editorjs>`);
}

export function ymfToEditorJs(ymf: YMF) {
  if (
    ymf.root.children.length === 1 &&
		ymf.root.children[0].type === 'tag' &&
		ymf.root.children[0].tag === 'editorjs'
  ) {
    const root: IYMFTagNode = ymf.root.children[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blocks: Array<any> = [];
    for (const child of root.children) {
      if (child.type === 'text') {
        // do nothing, skip line breaks
      } else if (child.type === 'tag') {
        if (child.tag === 'p') {
          blocks.push({
            id: child.attributes['ejs-id'],
            type: 'paragraph',
            data: {
              text: child.children.map(c => YMF.nodeToYMFText(c)).join(''),
            },
          });
        } else if (child.tag.startsWith('h')) {
          const level = parseInt(child.tag[1], 10);
          blocks.push({
            id: child.attributes['ejs-id'],
            type: 'header',
            data: {
              text: child.children.map(c => YMF.nodeToYMFText(c)).join(''),
              level,
            },
          });
        } else if (child.tag === 'ol') {
          blocks.push({
            id: child.attributes['ejs-id'],
            type: 'list',
            data: {
              style: 'ordered',
              items: child.children
                .filter(c => c.type === 'tag')
                .map(c =>
                  (c as IYMFTagNode).children
                    .slice(1)
                    .map(c => YMF.nodeToYMFText(c))
                    .join(''),
                ),
            },
          });
        } else if (child.tag === 'ul') {
          blocks.push({
            id: child.attributes['ejs-id'],
            type: 'list',
            data: {
              style: 'unordered',
              items: child.children
                .filter(c => c.type === 'tag')
                .map(c =>
                  (c as IYMFTagNode).children
                    .slice(1)
                    .map(c => YMF.nodeToYMFText(c))
                    .join(''),
                ),
            },
          });
        } else {
          // do nothing
        }
      }
    }

    return {
      ...EMPTY_OUTPUT_DATA,
      blocks,
    };
  } else {
    return {
      ...EMPTY_OUTPUT_DATA,
      blocks: [ { id: generateEditorJsId(), type: 'paragraph', data: { text: ymf.toPlainText() } } ],
    };
  }
}

function generateEditorJsId() {
  return new SmartBuffer(randomBytes(8)).toHexString();
}

export function isEmptyYMF(ymf: YMF) {
  return !ymf.toString();
}
