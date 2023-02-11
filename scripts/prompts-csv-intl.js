const { translate } = require('bing-translate-api');
const csv = require('csvtojson');
const path = require('path');
const fs = require('fs');

async function run() {
  const csvFilePath = path.resolve(__dirname, './prompts.csv');
  const outFilePath = path.resolve(__dirname, './prompts.json');

  const prompts = await csv().fromFile(csvFilePath);

  const promises = prompts.map(async (prompt, index) => {
    const act_zh = await intl(prompt.act).catch(err => {
      console.log(err);
      return null;
    });

    prompt['act_zh'] = act_zh;
    prompt['id'] = index;

    return prompt;
  });

  const res = await Promise.all(promises);

  writeFile(outFilePath, JSON.stringify(res, null, 2));
}

function writeFile(path, content) {
  fs.writeFileSync(path, content, {
    encoding: 'utf8',
  });
}

async function intl(text) {
  const res = await translate(text, 'en', 'zh-Hans', true);
  return res.translation;
}

run();
