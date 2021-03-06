import classNames from "classnames"
import React, {FC} from "react"
import styled, {keyframes} from "styled-components"

import {gradientEase} from "@app/src/utils/gradientEase"

const shine = keyframes`
  from {
    background-position: 400% top;
  }

  to {
    background-position: 0% top;
  }
`

const Shiny = styled.div`
  animation: ${shine} 8s linear infinite;
`

type Props = {
  className?: string
}

const LoadingShine: FC<Props> = ({className}) => {
  return (
    <Shiny
      className={classNames(`bg-gray-300`, className)}
      style={{
        backgroundImage: gradientEase(`easeInOutSine`, [`#ccc`, `#eee`, `#ccc`], [0.3, 0.5, 0.7], `70deg`),
        backgroundSize: `800% 100%`,
      }}
    />
  )
}

export default LoadingShine
