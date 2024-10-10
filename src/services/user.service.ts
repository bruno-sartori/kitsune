import httpStatus from 'http-status';
import ApiError from '@errors/ApiError';
import User from '@models/user';

class UserService {
  public async getById(id: number) {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error) {
      throw new ApiError('Error creating user', 'API_ERROR', httpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}

export default UserService;
