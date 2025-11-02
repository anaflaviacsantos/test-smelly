const { UserService } = require ('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Suíte de Testes sem Smells', () => {
  let userService;
  
  // O setup é executado antes de cada teste
  beforeEach(() => {
    userService = new UserService();
    userService._clearDB(); // Limpa o "banco" para cada teste
  });

  
  // O teste original foi dividido em dois 
  // O teste agora apenas cria o usuário e verifica sua criação
  test('deve criar um usuário corretamente', () => {
  // Arrange
  const nome = dadosUsuarioPadrao.nome;
  const email = dadosUsuarioPadrao.email;
  const idade = dadosUsuarioPadrao.idade;

  // Act: Criar o usuário
  const usuarioCriado = userService.createUser(nome, email, idade);

  // Assert: Verificar a criação
  expect(usuarioCriado.id).toBeDefined();
  expect(usuarioCriado.nome).toBe(nome);
  expect(usuarioCriado.email).toBe(email);
  expect(usuarioCriado.idade).toBe(idade);
  expect(usuarioCriado.status).toBe('ativo');
  });
  
  // A busca do usuário foi separada em outro teste
  test('deve buscar um usuário existente por ID', () => {
  // Arrange
  const usuarioCriado = userService.createUser(
    dadosUsuarioPadrao.nome,
    dadosUsuarioPadrao.email,
    dadosUsuarioPadrao.idade
  );

  // Act
  const usuarioBuscado = userService.getUserById(usuarioCriado.id);

  // Assert
  expect(usuarioBuscado).toBeDefined();
  expect(usuarioBuscado.id).toBe(usuarioCriado.id);
  expect(usuarioBuscado.nome).toBe(dadosUsuarioPadrao.nome);
  expect(usuarioBuscado.email).toBe(dadosUsuarioPadrao.email);
  });


  // O teste original foi dividido em dois
  // O primeiro teste agora verifica a desativação de um usuário comum
  test('deve desativar usuários se eles não forem administradores', () => {
  // Arrange
  const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

  // Act
  const resultado = userService.deactivateUser(usuarioComum.id);

  // Assert
  expect(resultado).toBe(true);
  const usuarioAtualizado = userService.getUserById(usuarioComum.id);
  expect(usuarioAtualizado.status).toBe('inativo');
  });
  

  // Para complementar, um segundo teste verifica que administradores não são desativados
  test('não deve desativar um usuário administrador', () => {
  // Arrange
  const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

  // Act
  const resultado = userService.deactivateUser(usuarioAdmin.id);

  // Assert
  expect(resultado).toBe(false);
  const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);
  expect(usuarioAtualizado.status).toBe('ativo');
  });


  test('deve gerar um relatório de usuários formatado', () => {
  // Arrange
  const usuario1 = userService.createUser('Alice', 'alice@email.com', 28);
  const usuario2 = userService.createUser('Bob', 'bob@email.com', 32);

  // Act
  const relatorio = userService.generateUserReport();

  // Assert 
  expect(relatorio).toBeDefined();
  expect(typeof relatorio).toBe('string');
  expect(relatorio.length).toBeGreaterThan(0);

  expect(relatorio).toContain('Alice');
  expect(relatorio).toContain('Bob');
  expect(relatorio).toContain(String(usuario1.id));
  expect(relatorio).toContain(String(usuario2.id));
 });
  
  
  test('deve falhar ao criar usuário menor de idade', () => {
  // Arrange
  const nome = 'Menor';
  const email = 'menor@email.com';
  const idade = 17;

  // Act e Assert
  expect(() => userService.createUser(nome, email, idade)).toThrow('O usuário deve ser maior de idade.');
  });
});