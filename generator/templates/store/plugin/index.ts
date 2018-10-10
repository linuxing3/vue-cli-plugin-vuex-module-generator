import { PersistencePlugin } from "./PersistentPlugin";

import { collections } from "@/api/models/BaseModel";

import pathify from "./pathify";
pathify.debug();

const plugins: any[] = [];

// 启用Pathify插件
plugins.push(pathify.plugin);

// 启用写入硬盘插件
collections.forEach((collection: string) => {
  plugins.push(PersistencePlugin({ namespace: collection }));
});

export default plugins;
