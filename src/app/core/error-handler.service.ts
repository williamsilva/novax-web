import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MessageService } from 'primeng/api';

import { AuthService } from '../auth';
import { NotAuthenticatedError } from '../auth/jwt-http-interceptor';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(
    private auth: AuthService,
    private messageService: MessageService
  ) {}

  handle(errorResponse: any) {
    let msg: string = '';

    if (typeof errorResponse === 'string') {
      msg = errorResponse;
    } else if (errorResponse.error.error === 'invalid_grant') {
      msg = 'Usuário inexistente ou senha inválida';
    } else if (errorResponse instanceof NotAuthenticatedError) {
      this.messageService.add({
        severity: 'warn',
        detail: 'Sua sessão expirou',
      });
      this.auth.login();
    } else if (
      errorResponse instanceof HttpErrorResponse &&
      errorResponse.status >= 400 &&
      errorResponse.status <= 499 &&
      errorResponse.error.error !== 'invalid_grant'
    ) {
      msg = 'Ocorreu um erro ao processar a sua solicitação';

      if (errorResponse.status === 400) {
        msg = errorResponse.error.userMessage;
      }

      if (errorResponse.status === 401) {
        if (errorResponse.error === 'invalid_token') {
          msg = 'Access token expired';
        }
      }

      if (errorResponse.status === 403) {
        msg = 'Você não tem permissão para executar esta ação';
      }

      if (errorResponse.status === 404) {
        msg = 'Não foram encontrados dados para a pesquisa!';
      }

      if (errorResponse.status === 409) {
        msg = errorResponse.error.userMessage;
      }
    } else if (
      errorResponse.status >= 500 &&
      errorResponse.status <= 599 &&
      errorResponse.error.error !== 'invalid_grant'
    ) {
      msg = 'erro interno do servidor';

      if (errorResponse.status === 503) {
        msg = 'Serviço Indisponível';
      }

      if (errorResponse.status === 504) {
        msg = 'Gateway Timeout';
      }

      try {
        msg = errorResponse.error[0].mensagemUsuario;
      } catch (e) {}
    } else {
      msg = 'Erro ao processar serviço remoto. Tente novamente.';
      console.error('Ocorreu um erro', errorResponse);
    }
    this.messageService.add({ severity: 'error', detail: msg });
  }
}
