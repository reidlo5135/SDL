import { Controller, Logger } from "@nestjs/common";
import { LogsService } from "../application/logs.service"

@Controller()
export class LogsController {
    private readonly logger: Logger = new Logger(LogsController.name);

    constructor(private readonly logsService: LogsService) {}

}