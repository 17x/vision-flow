interface ModulePanelProps {

}

const modules: Partial<ModuleProps>[] = [
  {
    type: 'rectangle',
    width: 100,
    height: 50,
  }, {
    type: 'rectangle',
    width: 100,
    height: 50,
  }, {
    type: 'rectangle',
    width: 100,
    height: 50,
  }, {
    type: 'rectangle',
    width: 100,
    height: 50,
  }, {
    type: 'rectangle',
    width: 100,
    height: 50,
  }, {
    type: 'rectangle',
    width: 100,
    height: 50,
  },
]

export const ModuleList: React.FC<ModulePanelProps> = () => {

  return (
    <div className={'flex flex-wrap space-x-2 space-y-2'}>
      {
        modules.map((module, index) => (
          <div className={'shrink-0 select-none cursor-move'}
               key={index}
               style={{
                 width: module.width,
                 height: module.height,
                 border: '1px solid #dfdfdf',
               }}
               onMouseEnter={() => {

               }}
          >

          </div>
        ))
      }
    </div>
  );
};