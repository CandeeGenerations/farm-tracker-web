import {TabsProps} from '@radix-ui/react-tabs'
import Link from 'next/link'
import React from 'react'

import {Tabs, TabsList, TabsTrigger} from '../ui/tabs'

interface ILinkTab {
  name: string
  href?: string
  active: boolean
}

interface ILinkTabs extends TabsProps, React.RefAttributes<HTMLDivElement> {
  tabs: ILinkTab[]
}

const LinkTabs = ({tabs, ...props}: ILinkTabs): React.ReactElement => {
  return (
    tabs.length > 0 && (
      <Tabs {...props} defaultValue={tabs.find((tab) => tab.active)?.name}>
        <TabsList className="grid w-full grid-cols-2">
          {tabs.map((tab) =>
            tab.active || !tab.href ? (
              <TabsTrigger key={tab.name} value={tab.name}>
                {tab.name}
              </TabsTrigger>
            ) : (
              <Link key={tab.name} href={tab.href} className="inline-flex items-center justify-center">
                <TabsTrigger value={tab.name}>{tab.name}</TabsTrigger>
              </Link>
            ),
          )}
        </TabsList>
      </Tabs>
    )
  )
}

export default LinkTabs
