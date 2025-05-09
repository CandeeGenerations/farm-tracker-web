import {IUserInfo} from '@/providers/user.provider'
import {Avatar, AvatarFallback, AvatarImage} from '@radix-ui/react-avatar'
import {DropdownMenuSub} from '@radix-ui/react-dropdown-menu'
import Avvvatars from 'avvvatars-react'
import {lowerCase} from 'change-case-all'
import Link from 'next/link'
import React from 'react'

import {Button} from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

type DropdownMenuItemType = {
  type: 'item'
  label: string
  shortcut?: string
  disabled?: boolean
  href?: string
  onClick?: () => void
}

type DropdownMenuLabelType = {
  type: 'label'
  label: string
}

type DropdownMenuSeparatorType = {
  type: 'separator'
}

type DropdownMenuSubTriggerType = {
  type: 'subTrigger'
  label: string
}

type DropdownMenuSubContentType = {
  type: 'subContent'
  items: (DropdownMenuItemType | DropdownMenuSeparatorType)[]
}

type DropdownMenuSubType = {
  type: 'sub'
  trigger: DropdownMenuSubTriggerType
  content: DropdownMenuSubContentType
}

type DropdownMenuGroupType = {
  type: 'group'
  items: (DropdownMenuItemType | DropdownMenuSubType)[]
}

type DropdownMenuElementType =
  | DropdownMenuItemType
  | DropdownMenuLabelType
  | DropdownMenuSeparatorType
  | DropdownMenuGroupType

type DropdownMenuType = DropdownMenuElementType[]

// EXAMPLE:
// const dropdownMenu: DropdownMenuType = [
//   {type: 'label', label: 'My Account'},
//   {type: 'separator'},
//   {
//     type: 'group',
//     items: [
//       {type: 'item', label: 'Profile', shortcut: '⇧⌘P'},
//       {type: 'item', label: 'Billing', shortcut: '⌘B'},
//       {type: 'item', label: 'Settings', shortcut: '⌘S'},
//       {type: 'item', label: 'Keyboard shortcuts', shortcut: '⌘K'},
//     ],
//   },
//   {type: 'separator'},
//   {
//     type: 'group',
//     items: [
//       {type: 'item', label: 'Team'},
//       {
//         type: 'sub',
//         trigger: {type: 'subTrigger', label: 'Invite users'},
//         content: {
//           type: 'subContent',
//           items: [
//             {type: 'item', label: 'Email'},
//             {type: 'item', label: 'Message'},
//             {type: 'separator'},
//             {type: 'item', label: 'More...'},
//           ],
//         },
//       },
//       {type: 'item', label: 'New Team', shortcut: '⌘+T'},
//     ],
//   },
//   {type: 'separator'},
//   {type: 'item', label: 'GitHub'},
//   {type: 'item', label: 'Support'},
//   {type: 'item', label: 'API', disabled: true},
//   {type: 'separator'},
//   {type: 'item', label: 'Log out', shortcut: '⇧⌘Q'},
// ]

interface INewMenu {
  userInfo?: IUserInfo
  text?: string
  contentProps?: typeof DropdownMenuContent
  buttonProps?: typeof Button
  menuItems: DropdownMenuType
}

const Menu = ({userInfo, text, contentProps, buttonProps, menuItems}: INewMenu): React.ReactElement => {
  const renderDropdownItem = (item: DropdownMenuItemType) => {
    const dropdownMenuItem = (
      <DropdownMenuItem key={item.label} disabled={item.disabled} onClick={item.onClick} className="cursor-pointer">
        {item.label}
        {item.shortcut && <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>}
      </DropdownMenuItem>
    )

    return item.href ? <Link href={item.href}>{dropdownMenuItem}</Link> : dropdownMenuItem
  }

  const renderDropdownPortal = (subContent: DropdownMenuSubContentType) => (
    <DropdownMenuPortal>
      <DropdownMenuSubContent>
        {subContent.items.map((itemOrSeparator, index) =>
          itemOrSeparator.type === 'separator' ? (
            <DropdownMenuSeparator key={index} />
          ) : (
            renderDropdownItem(itemOrSeparator)
          ),
        )}
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  )

  const renderDropdownElement = (element: DropdownMenuElementType) => {
    switch (element.type) {
      case 'label':
        return <DropdownMenuLabel key={element.label}>{element.label}</DropdownMenuLabel>

      case 'separator':
        return <DropdownMenuSeparator key={Math.random()} />

      case 'group':
        return (
          <DropdownMenuGroup key={element.items.toString()}>
            {element.items.map((itemOrSub) =>
              itemOrSub.type === 'sub' ? (
                <DropdownMenuSub key={itemOrSub.trigger.label}>
                  <DropdownMenuSubTrigger>{itemOrSub.trigger.label}</DropdownMenuSubTrigger>
                  {renderDropdownPortal(itemOrSub.content)}
                </DropdownMenuSub>
              ) : (
                renderDropdownItem(itemOrSub as DropdownMenuItemType)
              ),
            )}
          </DropdownMenuGroup>
        )

      case 'item':
        return renderDropdownItem(element)

      default:
        return null
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {userInfo ? (
          <Button variant="ghost" className="flex items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Avatar>
                  <AvatarImage src={userInfo.image} alt={userInfo.name} />

                  <AvatarFallback>
                    {userInfo.name && userInfo.initials ? (
                      <Avvvatars value={userInfo.name} displayValue={userInfo.initials} />
                    ) : (
                      <Avvvatars value={userInfo.email} style="shape" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="ml-3 text-left">
                <div className="font-medium leading-none text-muted-dark" id="top-bar--name">
                  {userInfo?.name}
                </div>

                <div className="font-medium leading-none text-muted-mid" id="top-bar--email-address">
                  {lowerCase(userInfo?.email || '')}
                </div>
              </div>
            </div>
          </Button>
        ) : (
          <Button variant="outline" {...(buttonProps || {})}>
            {text || 'Open'}
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" {...(contentProps || {})}>
        {menuItems.map((element) => renderDropdownElement(element))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Menu
