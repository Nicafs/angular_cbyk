export type TDriver = {
  nome: string;
};

export type TOriginClient = {
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
};

export type TDestinyClient = {
  nome: string;
  endereco: string;
  bairro: string;
  cidade: string;
};

export type TDelivery = {
  id: number;
  documento: string;
  motorista: TDriver;
  cliente_origem: TOriginClient;
  cliente_destino: TDestinyClient;
  status_entrega: string;
};
