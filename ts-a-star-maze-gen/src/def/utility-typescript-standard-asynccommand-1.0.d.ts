declare module puremvc_async {
    interface IAsyncCommand extends puremvc.ICommand {
        setOnComplete(value: Function): void;
    }

    class AsyncCommand extends puremvc.SimpleCommand implements IAsyncCommand {
        public setOnComplete(value: Function): void;
        public commandComplete(): void;
        private onComplete;
    }

    class AsyncMacroCommand extends puremvc.Notifier implements IAsyncCommand, puremvc.ICommand, puremvc.INotifier {
        private subCommands;
        private note;
        private onComplete;
        constructor();
        public initializeMacroCommand(): void;
        public addSubCommand(commandClassRef: Function): void;
        public setOnComplete(value: Function): void;
        public execute(notification: puremvc.INotification): void;
        private nextCommand();
    }
}