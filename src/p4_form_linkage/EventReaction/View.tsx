import { observer } from "mobx-react-lite";
import { Select, Form, Button } from "antd";
import { useDebugValue, useEffect, useMemo } from "react";
import { Model } from "./Model";
import { createAction } from "./eventContext";

export const EventReaction = observer(() => {
  const model = useMemo(() => new Model(), []);
  const { province, city, area, provinceSource, citySource, areaSource } =
    model;

  const actions = useMemo(() => {
    return {
      onReset: createAction(model.onReset, "reset"),
      onReload: createAction(model.onReload, "reload"),
      onChangeProvince: createAction(model.onChangeProvince, "input"),
      onChangeCity: createAction(model.onChangeCity, "input"),
      onChangeArea: createAction(model.onChangeArea, "input"),
    };
  }, [model]);

  useEffect(() => model.bootstrap(), []);

  useDebugValue({
    model,
    province,
    city,
    area,
    provinceOptions: provinceSource.data,
    cityOptions: citySource.data,
    areaOptions: areaSource.data,
  });
  return (
    <>
      <Button onClick={actions.onReset}>Reset</Button>
      <Button onClick={actions.onReload}>Reload</Button>
      <Form.Item label="Province">
        <Select
          loading={provinceSource.loading}
          value={province}
          onChange={actions.onChangeProvince}
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
          onChange={actions.onChangeCity}
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
          onChange={actions.onChangeArea}
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
});

EventReaction.displayName = "EventReaction";
