import React from 'react'
import {Config, PopperOptions, usePopperTooltip} from 'react-popper-tooltip'
import 'react-popper-tooltip/dist/styles.css'

export interface ITooltip {
  tooltipText: React.ReactNode
  children?: React.ReactNode
  tooltipConfig?: Config
  tooltipOptions?: PopperOptions
}

const Tooltip = ({
  children,
  tooltipText,
  tooltipConfig = {
    delayShow: 150,
    placement: 'top-start',
  },
  tooltipOptions,
}: ITooltip): React.ReactElement => {
  const {getTooltipProps, setTooltipRef, setTriggerRef, visible} = usePopperTooltip(tooltipConfig, tooltipOptions)

  return (
    <>
      <div className="inline-block" ref={setTriggerRef}>
        {children}
      </div>

      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: 'shadow font-normal rounded border border-slate-700 tooltip-container bg-slate-700 text-white',
            style: {maxWidth: 500, whiteSpace: 'pre-wrap'},
          })}
        >
          {tooltipText}
        </div>
      )}
    </>
  )
}

export default Tooltip
