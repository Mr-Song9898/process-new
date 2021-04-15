import Demo from '../components/index';
const { Edit, Test, DOME2, Modes, Process, RegisterX, RegisterProcess } = Demo;

const DemoMap = {
  node: <Edit />,
  edge: <DOME2 />,
  modes: <Modes />,
  process: <Process />,
  registerX: <RegisterX />,
  registerProcess: <RegisterProcess />,
};

export const disPlayCurrentDome = (key) => {
  return DemoMap[key] ? DemoMap[key] : <Test />
};
