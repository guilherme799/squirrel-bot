USE [master];
GO
-- Inicialização do banco de dados SquirrelBot
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'squirrelbot')
BEGIN
    CREATE DATABASE [squirrelbot];
    PRINT 'Banco de dados [squirrelbot] criado com sucesso.';
END
GO

USE [squirrelbot];
GO

-- Criação da tabela SavedFiles
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'SavedFiles')
BEGIN
    CREATE TABLE SavedFiles (
        id UNIQUEIDENTIFIER PRIMARY KEY NOT NULL,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        remoteJid VARCHAR(255) NOT NULL,
        comments VARCHAR(MAX)
    );
    PRINT 'Tabela [SavedFiles] criada com sucesso.';
END
GO