import { IUser } from '@/types/user';

describe('User Types', () => {
  it('should define IUser interface correctly', () => {
    // Create a mock object that conforms to IUser
    const requiredUser: IUser = {
      _id: '12345',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    };
    
    // Create a user with optional properties
    const completeUser: IUser = {
      _id: '67890',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'admin',
      companyName: 'Acme Inc',
      picture: 'https://example.com/picture.jpg'
    };
    
    // Assert the objects have the expected properties
    expect(requiredUser).toHaveProperty('_id');
    expect(requiredUser).toHaveProperty('name');
    expect(requiredUser).toHaveProperty('email');
    expect(requiredUser).toHaveProperty('role');
    
    expect(completeUser).toHaveProperty('companyName');
    expect(completeUser).toHaveProperty('picture');
  });
}); 