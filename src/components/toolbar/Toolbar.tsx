import React, {useContext} from 'react'
import {Col, Con, IconButton, Tooltip} from '@lite-u/ui'
import WorkspaceContext from '../../contexts/workspaceContext/WorkspaceContext.tsx'
import {ToolName} from '@lite-u/editor/types'
import {LuCircle, LuHand, LuPencilLine, LuRectangleHorizontal, LuZoomIn} from 'react-icons/lu'
import {lineSeg, mousePointer} from '../../assets/svg/icons.tsx'

const toolList = [
  {
    name: 'Selector',
    icon: mousePointer(),
    toolName: 'selector',
  },
  {
    name: 'Line Segment',
    icon: lineSeg(),
    toolName: 'lineSegment',
  },
  {
    name: 'Rectangle',
    icon: <LuRectangleHorizontal/>,
    toolName: 'rectangle',
  },
  {
    name: 'Circle',
    icon: <LuCircle/>,
    toolName: 'ellipse',
  },
  {
    name: 'Text',
    icon: 'T',
    toolName: 'text',
  },
  {
    name: 'Pencil',
    icon: <LuPencilLine/>,
    toolName: 'pencil',
  },
  {
    name: 'Hand',
    icon: <LuHand/>,
    toolName: 'panning',
  },
  {
    name: 'Zoom',
    icon: <LuZoomIn/>,
    toolName: 'zoomIn',
  },
]

const Toolbar: React.FC<{ tool: ToolName }> = ({tool}) => {
  const {executeAction} = useContext(WorkspaceContext)

  return <Col fh center flex={0} w={50} style={{
    borderRight: '1px solid #e4e4e4',
  }}>
    {
      toolList.map(({toolName, name, icon}) => {
        const active = toolName === tool
        return <Tooltip placement={'r'} title={name} key={name}>
          <Con p={2} w={40} h={40}>
            <IconButton xs style={{
              width: '100%',
              height: '100%',
              color: active ? 'white' : 'black',
              borderRadius: 3,
              backgroundColor: active ? '#aaa' : 'white',
              fontSize: 18,
              outline: 'none',
            }}
                        onClick={() => {
                          executeAction('switch-tool', toolName)
                        }}>{icon}</IconButton>
          </Con>
        </Tooltip>

      })
    }
  </Col>
}

export default Toolbar