import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ClientService } from 'src/clients/clients.service';
import { RolesGuard } from 'src/roles/roles.guard';
import { createSuccess, ErrorException } from 'src/utils/response.handler';

@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)

export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  async getAllClients() {
    try {
      return createSuccess('getAllClients', await this.clientService.getAllClients());
    } catch (error) {
      throw new ErrorException('getAllClients', 'Error in getting all clients', error);
    }
  }

  @Post()
  async addClient(@Body() client: any) {
    try {
      return createSuccess('addClient', await this.clientService.addClient(client));
    } catch (error) {
      throw new ErrorException('addClient', 'Error in adding client', error);
    }
  }

  @Get('by-email/:email')
  async getClientByEmail(@Param('email') email: string) {
    try {
      return createSuccess('getClientByEmail', await this.clientService.getClientByEmail(email));
    } catch (error) {
      throw new ErrorException('getClientByEmail', 'Error in getting client by email', error);
    }
  }

  @Get('trip-history/:clientId')
  async getClientTripHistory(@Param('clientId') clientId: number) {
    try {
      return createSuccess('getClientTripHistory', await this.clientService.getClientTripHistory(clientId));
    } catch (error) {
      throw new ErrorException('getClientTripHistory', 'Error in getting client trip history', error);
    }
  }

  @Delete(':clientId')
  async deactivateClient(@Param('clientId') clientId: number) {
    try {
      return createSuccess('deactivateClient', await this.clientService.deactivateClient(clientId));
    } catch (error) {
      throw new ErrorException('deactivateClient', 'Error in deactivating client', error);
    }
  }
}
