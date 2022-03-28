import {
  action,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from "mobx";
import { Subscription } from "rxjs";
import { AsyncSource } from "../AsyncSource";
import { getAreas, getCities, getProvinces } from "../datasource";
import { createAction, getEventContext, isInput } from "./eventContext";

export class Model {
  province = "";
  city = "";
  area = "";
  constructor() {
    makeObservable(this, {
      province: observable.ref,
      city: observable.ref,
      area: observable.ref,
      onChangeProvince: action,
      onChangeCity: action,
      onChangeArea: action,
      onReload: action,
      onReset: action,
    });
  }
  // mobx 本身是一个 reactive 的 stateRef
  // 默认不 track，行为与普通对象一致，与【渲染】解耦，同一时间必然之存在一个值，没有闭包问题。
  // 在 observer 包裹的组件，reaction，autorun中进行 track 来实现 reactivity。
  // 结论：mobx 的 reactivity 是【专为单线程 & 人机交互】实现的一套全局【单例】响应式机制。
  provinceSource = new ProvinceSource();
  citySource = new CitySource();
  areaSource = new AreaSource();

  bootstrap = () => {
    const sub = new Subscription();
    // 数据源加载。
    sub.add(this.provinceSource.connect());
    sub.add(this.citySource.connect());
    sub.add(this.areaSource.connect());
    // 可选项联动。
    sub.add(
      reaction(
        () => this.province,
        (v) => {
          console.log("autoSelectCity", getEventContext());
          const autoSelectCity = createAction((cities: string[]) => {
            console.log("autoSelectCity.isInput", isInput());
            if (isInput() && cities[0]) {
              runInAction(() => this.onChangeCity(cities[0]));
            }
          });
          this.citySource.fetch(v).then((cities) => {
            console.log({ cities, citySource: this.citySource });
            autoSelectCity(cities);
          });
        },
        { fireImmediately: true },
      ),
    );
    sub.add(
      reaction(
        () => ({
          province: this.province,
          city: this.city,
        }),
        ({ province, city }) => {
          console.log("autoSelectArea", getEventContext());
          const autoSelectArea = createAction((areas: string[]) => {
            console.log("autoSelectArea.isInput", isInput());
            if (isInput() && areas[0]) {
              runInAction(() => this.onChangeArea(areas[0]));
            }
          });
          this.areaSource.fetch([province, city]).then((areas) => {
            console.log({ areas, areaSource: this.areaSource });
            autoSelectArea(areas);
          });
        },
        { fireImmediately: true },
      ),
    );
    this.provinceSource.fetch();
    return () => sub.unsubscribe();
  };

  onChangeProvince = (v: string) => {
    this.province = v;
  };
  onChangeCity = (v: string) => {
    this.city = v;
  };
  onChangeArea = (v: string) => {
    this.area = v;
  };

  onReload = () => {
    this.province = "北京市";
    this.city = "北京市";
    this.area = "朝阳区";
  };

  onReset = () => {
    this.province = "";
    this.city = "";
    this.area = "";
  };
}

class ProvinceSource extends AsyncSource<void, string[]> {
  connect = () => {
    return this.bootstrap(() => getProvinces());
  };
}
class CitySource extends AsyncSource<string, string[]> {
  connect = () => {
    return this.bootstrap((v) => getCities(v));
  };
}
class AreaSource extends AsyncSource<[string, string], string[]> {
  connect = () => {
    return this.bootstrap((v) => getAreas(...v));
  };
}
