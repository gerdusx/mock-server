import { Injectable } from '@nestjs/common';
import { users } from './data/users';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DevService {
  private seedResults: any = null;

  private readonly seedResultsPath: string;
  private readonly mockResponsesPath: string;

  constructor() {
    // Store in data directory at project root
    this.seedResultsPath = path.join(
      process.cwd(),
      'src/dev/data/seed-results.json',
    );
    this.mockResponsesPath = path.join(
      process.cwd(),
      'src/dev/data/mock-responses.json',
    );
  }

  findAllUsers() {
    console.log('users');
    return users;
  }

  findUserByIndex(index: number) {
    if (index < 0 || index >= users.length) {
      return {
        error: `Index ${index} is out of range. Valid range: 0-${users.length - 1}`,
      };
    }
    return users[index];
  }

  findUserByMobile(mobile: string) {
    const user = users.find((u) => u.mobile === mobile);
    if (!user) {
      return { error: `User with mobile ${mobile} not found` };
    }
    return user;
  }

  findUserByIdNumber(idNumber: string) {
    const user = users.find((u) => u.idNumber === idNumber);
    if (!user) {
      return { error: `User with id number ${idNumber} not found` };
    }
    return user;
  }

  findRandomUser() {
    if (users.length === 0) {
      return { error: 'No users available' };
    }
    const randomIndex = Math.floor(Math.random() * users.length);
    return users[randomIndex];
  }

  saveSeedResults(results: any) {
    try {
      const dataDir = path.dirname(this.seedResultsPath);
      // Ensure directory exists
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Write to file
      fs.writeFileSync(
        this.seedResultsPath,
        JSON.stringify(results, null, 2),
        'utf-8',
      );

      return {
        message: 'Seed results saved successfully',
        timestamp: new Date().toISOString(),
        path: this.seedResultsPath,
      };
    } catch (error) {
      throw new Error(`Failed to save seed results: ${error.message}`);
    }
  }

  getSeedResults() {
    try {
      console.log('path: ', this.seedResultsPath);
      if (!fs.existsSync(this.seedResultsPath)) {
        return {
          message: 'No seed results available. Run the seed script first.',
        };
      }

      const fileContent = fs.readFileSync(this.seedResultsPath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      return {
        message: 'Failed to read seed results',
        error: error.message,
      };
    }
  }

  getMockConfig() {
    try {
      if (!fs.existsSync(this.mockResponsesPath)) {
        return {
          config: this.getDefaultMockConfig(),
          availableOptions: this.getAvailableMockOptions(),
        };
      }

      const fileContent = fs.readFileSync(this.mockResponsesPath, 'utf-8');
      const config = JSON.parse(fileContent);

      return {
        config,
        availableOptions: this.getAvailableMockOptions(),
      };
    } catch (error) {
      return {
        config: this.getDefaultMockConfig(),
        availableOptions: this.getAvailableMockOptions(),
      };
    }
  }

  setMockConfig(config: any) {
    try {
      const dataDir = path.dirname(this.mockResponsesPath);
      // Ensure directory exists
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Read current config or use default
      let currentConfig = this.getDefaultMockConfig();
      if (fs.existsSync(this.mockResponsesPath)) {
        const fileContent = fs.readFileSync(this.mockResponsesPath, 'utf-8');
        currentConfig = JSON.parse(fileContent);
      }

      // Merge with new config (supports partial updates)
      const updatedConfig = this.deepMerge(currentConfig, config);

      // Write to file
      fs.writeFileSync(
        this.mockResponsesPath,
        JSON.stringify(updatedConfig, null, 2),
        'utf-8',
      );

      return {
        message: 'Mock config updated successfully',
        timestamp: new Date().toISOString(),
        config: updatedConfig,
      };
    } catch (error) {
      throw new Error(`Failed to save mock config: ${error.message}`);
    }
  }

  resetMockConfig() {
    try {
      const defaultConfig = this.getDefaultMockConfig();
      fs.writeFileSync(
        this.mockResponsesPath,
        JSON.stringify(defaultConfig, null, 2),
        'utf-8',
      );

      return {
        message: 'Mock config reset to defaults',
        timestamp: new Date().toISOString(),
        config: defaultConfig,
      };
    } catch (error) {
      throw new Error(`Failed to reset mock config: ${error.message}`);
    }
  }

  private getDefaultMockConfig() {
    return {
      identification: {
        'verify_person_03': 'success_with_photo',
        'rsa_id_verify_03': 'face_identical',
        'document_reader_11': 'green-book-positive',
        'facial_comparison_14': 'match',
        'address_match_04': 'address-match-has-history',
        'anti_money_laundering_01': 'no_results',
      },
    };
  }

  private getAvailableMockOptions() {
    return {
      'verify_person_03': [
        'success_with_photo',
        'success_no_photo',
        'success_invalid_photo',
        'id_blocked',
        'deceased',
        'server_error',
      ],
      'rsa_id_verify_03': [
        'face_identical',
        'face_missing',
        'face_not_identical',
        'face_null',
        'liveness_pass',
        'verification_failed',
        'deceased',
        'server_error',
      ],
      'document_reader_11': ['green-book-positive', 'green-book-negative'],
      'facial_comparison_14': ['match', 'no_match'],
      'address_match_04': ['address-match-has-history', 'address-match-no-history'],
      'anti_money_laundering_01': ['no_results', 'watchlist_match', 'pep_match', 'negative_media_match', 'match_found', 'match_found_compact', 'server_error'],
    };
  }

  private deepMerge(target: any, source: any): any {
    const output = { ...target };
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  private isObject(item: any): boolean {
    return item && typeof item === 'object' && !Array.isArray(item);
  }
}
