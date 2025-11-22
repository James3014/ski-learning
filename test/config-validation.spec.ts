import * as fs from 'fs';
import * as path from 'path';

describe('Configuration Files Validation', () => {
  describe('package.json', () => {
    let packageJson: any;

    beforeAll(() => {
      const packagePath = path.join(__dirname, '..', 'package.json');
      const content = fs.readFileSync(packagePath, 'utf-8');
      packageJson = JSON.parse(content);
    });

    it('should have postinstall script', () => {
      expect(packageJson.scripts).toHaveProperty('postinstall');
      expect(packageJson.scripts.postinstall).toBe('prisma generate');
    });

    it('should have build script with prisma generate', () => {
      expect(packageJson.scripts).toHaveProperty('build');
      expect(packageJson.scripts.build).toContain('prisma generate');
      expect(packageJson.scripts.build).toContain('nest build');
    });

    it('should have start:prod script', () => {
      expect(packageJson.scripts).toHaveProperty('start:prod');
      expect(packageJson.scripts['start:prod']).toBe('node dist/main');
    });

    it('should specify Node.js version >= 18', () => {
      expect(packageJson.engines).toHaveProperty('node');
      expect(packageJson.engines.node).toMatch(/>=\s*18/);
    });
  });

  describe('prisma/schema.prisma', () => {
    let schemaContent: string;

    beforeAll(() => {
      const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
      schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    });

    it('should include linux-musl-openssl-3.0.x binaryTarget', () => {
      expect(schemaContent).toContain('binaryTargets');
      expect(schemaContent).toContain('linux-musl-openssl-3.0.x');
    });

    it('should have native binaryTarget', () => {
      expect(schemaContent).toContain('native');
    });

    it('should use postgresql provider', () => {
      expect(schemaContent).toContain('provider = "postgresql"');
    });

    it('should use DATABASE_URL environment variable', () => {
      expect(schemaContent).toContain('env("DATABASE_URL")');
    });
  });

  describe('zbpack.json', () => {
    let zbpackJson: any;

    beforeAll(() => {
      const zbpackPath = path.join(__dirname, '..', 'zbpack.json');
      const content = fs.readFileSync(zbpackPath, 'utf-8');
      zbpackJson = JSON.parse(content);
    });

    it('should have build_command', () => {
      expect(zbpackJson).toHaveProperty('build_command');
      expect(zbpackJson.build_command).toContain('npm install');
      expect(zbpackJson.build_command).toContain('npm run build');
    });

    it('should have start_command', () => {
      expect(zbpackJson).toHaveProperty('start_command');
      expect(zbpackJson.start_command).toBe('npm run start:prod');
    });

    it('should specify node_version as 18', () => {
      expect(zbpackJson).toHaveProperty('node_version');
      expect(zbpackJson.node_version).toBe('18');
    });
  });
});
