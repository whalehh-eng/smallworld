# smallworld · 给你的小小世界

一份藏在像素小镇里的生日礼物。React + TypeScript + Vite + Phaser 3，无后端、无付费 API。

## 本地预览

安装 Node.js 22.18 或更新版本，在本目录执行：

```sh
npm install
npm run dev
```

浏览器打开终端显示的网址。生产构建 `npm run build`，检查地图 `npm test`，构建后预览 `npm run preview`。

## 怎么玩

点击「走进小小世界」，从卧室出发。电脑使用 WASD 或方向键，手机使用左下方方向键。靠近门或闪光标记，点击物品或「点击查看」，不需要按 E。

- 卧室墙上的相框：查看照片和大图。
- 房子右侧邮箱：展开生日信。
- 小镇右上咖啡馆：进门后，在中间的蛋糕桌旁点亮蜡烛、许愿、吹灭蜡烛。
- 湖边花园的宝箱：打开生日视频。视频未填入时显示预留页面。
- 弹窗底部或右上角都能返回游戏。音乐默认关闭，点击右上角开启原创合成旋律。

## 换成你们的内容

打开 `src/config/birthday.ts`，集中修改昵称、日期、信件、署名、祝福、照片和视频。引号中的文字可以直接替换，正文换行写 `\n`，不要删除引号和逗号。

把照片放到 `public/assets/`，例如 `photo-1.jpg`，对应照片条目写：

```ts
{ src: 'assets/photo-1.jpg', caption: '我们的那一天', note: '那天的风也很好。' }
```

顺序就是配置数组的顺序，可增删条目。没有照片时显示原创风景插画，明确标记为待替换，不冒充真实回忆。

把视频放到 `public/assets/birthday-video.mp4`，建议使用 H.264 编码的 MP4，压缩至手机易加载的大小。修改：

```ts
videoUrl: 'assets/birthday-video.mp4',
videoPoster: 'assets/birthday-video-cover.jpg',
```

封面可留空。视频不会自动播放，原生播放器有播放、暂停、进度、音量（受手机浏览器限制）和全屏控制。路径为空或视频加载失败时，仍然能关闭页面并继续游戏。GitHub Pages 使用相对路径 `assets/...`，不要在路径开头加 `/`。

## 美术与角色

`src/game/art.ts` 是原创代码绘制的像素素材，统一配色，无外部图片依赖。`character(direction, frame)` 返回单帧 Canvas，四方向编号：下 0、左 1、右 2、上 3，帧 0 为待机，其余为独立绘制的步态。角色以你提供的概念图中的长发、奶油外套、绿围巾和棕色小包为外观参考，没有直接裁剪概念图。

当前为可玩的原创初版，美术精细度仍低于提供的高细节概念图；需要正式精修的角色图集、更多树木和室内装饰来达到概念图级画面。不是商业游戏素材。场景使用 `makeMap`，地图障碍、出生点和交互坐标集中在 `src/game/layout.ts`，替换地图时需同步调整障碍。引擎与 React 通过 `src/game/bridge.ts` 通信。

## 部署与分享

### GitHub Pages

仓库已包含 `.github/workflows/deploy.yml`。

1. GitHub 仓库 Settings → Pages → Build and deployment，Source 选择 **GitHub Actions**。
2. 推送到 main，或在 Actions 中手动运行 **Deploy birthday world to GitHub Pages**。
3. 等待工作流绿色成功，再打开工作流显示的网站链接分享给朋友。

不要把预计地址当作已经上线的链接。构建使用相对资源路径，兼容 `/smallworld/` 子目录。

### Vercel

在 Vercel 中导入 `whalehh-eng/smallworld`，框架选 Vite，构建命令 `npm run build`，输出目录 `dist`，无需环境变量。部署成功后即可分享 Vercel 提供的链接。

## 已验证与待验证

- TypeScript 与 Vite 生产构建通过。
- 自动地图检查：三个出生点、所有交互的路径可达性、所有门的目的点碰撞、四个核心礼物的完整性，共 16 项。
- 组件测试 36 项：蛋糕点烛/许愿/吹灭、照片预览及返回、视频缺失和加载失败时回退、四种弹窗的关闭与返回。
- 已离线渲染并查看地图与四方向角色帧。
- 当前会话没有可调用的浏览器控制工具，因此没有将桌面/手机实机运行、点击、音频或真实视频播放标为已验收。请发布后实际走一遍四个互动，尤其检查你的真实媒体文件。
- 暂无真实照片、信件和生日视频，目前使用可替换示例文案与明确预留界面。

## 项目结构

- `src/components/`：游戏容器、方向键、四种礼物弹窗、音乐。
- `src/game/World.ts`：Phaser 游戏循环、角色移动、场景淡入淡出、范围交互。
- `src/game/layout.ts`：地图碰撞与入口配置。
- `src/game/art.ts`：原创地图和角色素材。
- `src/config/birthday.ts`：集中生日内容配置。
- `scripts/check-layout.mjs`：地图可达性与出生点测试。
