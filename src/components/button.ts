import { InlineKeyboardButton } from 'telegraf/typings/telegram-types';
import { v4 as uuid } from 'uuid';

import telegramService from '../telegram.service';

import { UnexpectedError } from '../errors';

import { VoidCommand } from '../commands/void';

import { FoolishComponent, ComponentState } from '../interfaces/component';

export interface ButtonState extends ComponentState {
    text: string;
    commandName: string;
    parentComponentId: string;
}

type StateArguments = Omit<ButtonState, 'componentId' | 'commandName'> & { commandName?: string };

export class ButtonComponent extends FoolishComponent<ButtonState> {
    get commandName(): string {
        return this.state.commandName;
    }

    static async create(state: StateArguments): Promise<ButtonComponent> {
        const button = new ButtonComponent();

        return button.setState(state);
    }

    async setState(state: StateArguments): Promise<this> {
        const componentId = uuid();
        this.state = { ...state, componentId, commandName: VoidCommand.name };
        await telegramService.stateStorage.save(componentId, this.name, this.state);

        return this;
    }

    toInlineKeyboardButton(): InlineKeyboardButton {
        const { text, componentId } = this.state;

        return { text, callback_data: componentId };
    }
}
