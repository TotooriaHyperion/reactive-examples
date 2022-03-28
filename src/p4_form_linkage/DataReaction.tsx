import { useEffect, useState } from "react";
import { Select, Form, Button } from "antd";
import { useRequest } from "ahooks";
import { getAreas, getCities, getProvinces } from "./datasource";

export const DataReaction = () => {
  const [[province, city, area], setState] = useState<string[]>([]);

  const onChangeProvince = (v: string) => {
    setState((old) => [v, old[1], old[2]]);
  };
  const onChangeCity = (v: string) => {
    setState((old) => [old[0], v, old[2]]);
  };
  const onChangeArea = (v: string) => {
    setState((old) => [old[0], old[1], v]);
  };

  const provinceSource = useRequest(() => getProvinces());
  /**
   * 由 data 触发数据获取
   * 由于只是【data】，所以没有【持久的引用】，因此无法与其他逻辑共享。
   */
  const citySource = useRequest(() => getCities(province), {
    refreshDeps: [province],
  });
  const areaSource = useRequest(() => getAreas(province, city), {
    refreshDeps: [province, city],
  });

  /**
   * 由 data 通过 useEffect 处理自动填充（业务逻辑）
   * 依赖【data】触发的渲染，无法区分【加载已有配置】，【用户输入】，【重置表单】三种行为。
   * 解决办法：提升【data】的表达力。如，每次渲染都有一个状态，可以拿到触发该渲染的 event。
   * 问题：由于 React的TimeSlicing和ConcurrentMode，【渲染】和【事件触发】之间并非同步关系，
   * 即：React的【渲染】必然抛弃了【用户行为】本身的【时间节点】，【同步性质】。
   * 因此：使用 React 的 useEffect 来表达【业务逻辑】，本质上意味着【model 的变化依赖了 view 的执行】。
   * 结论：非【纯视图逻辑】之外，都不应该使用 useEffect 实现。
   */
  useEffect(() => {
    getCities(province).then((cities) => {
      if (cities[0]) {
        onChangeCity(cities[0]);
      }
    });
  }, [province]);
  useEffect(() => {
    getAreas(province, city).then((areas) => {
      if (areas[0]) {
        onChangeArea(areas[0]);
      }
    });
  }, [province, city]);
  return (
    <>
      <Button onClick={() => setState([])}>Reset</Button>
      <Button onClick={() => setState(["北京市", "北京市", "朝阳区"])}>
        Reload
      </Button>
      <Form.Item label="Province">
        <Select
          loading={provinceSource.loading}
          value={province}
          onChange={onChangeProvince}
        >
          {provinceSource.data?.map((v) => (
            <Select.Option key={v} value={v}>
              {v}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="City">
        <Select
          loading={citySource.loading}
          value={city}
          onChange={onChangeCity}
        >
          {citySource.data?.map((v) => (
            <Select.Option key={v} value={v}>
              {v}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Area">
        <Select
          loading={areaSource.loading}
          value={area}
          onChange={onChangeArea}
        >
          {areaSource.data?.map((v) => (
            <Select.Option key={v} value={v}>
              {v}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};
