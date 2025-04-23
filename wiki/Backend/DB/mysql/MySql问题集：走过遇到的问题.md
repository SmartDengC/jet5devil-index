---
title: MySql问题集：走过遇到的问题
createTime: 2025/04/23 17:07:41
permalink: /article/hu039x3q/
tags:
  - mysql
  - 问题集
---

表A与表B字段关联，将表B的id存到表A里面：

```sql
UPDATE t_lub_inspection_task_list_detail as a
JOIN t_equ_bom as b ON a.CHILD_EQU_CODE = b.code and b.MECHANICS = 'ZY1'
SET a.CHILD_EQU_ID = b.id
where a.CHILD_EQU_ID is NULL;
```

单个表数据更新，根据名字转化成id：

```sql
UPDATE t_factory_task_list
SET WORK_TYPE = CASE 
    WHEN WORK_AREA_NAME = '设备' THEN 625572
    WHEN WORK_AREA_NAME = '功能位置' THEN 625573
    ELSE WORK_TYPE  -- 其他情况保持原值
END
WHERE WORK_TYPE is null ;  
```

