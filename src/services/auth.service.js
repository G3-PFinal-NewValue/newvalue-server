// ✅ services/auth.service.js (CON DEBUG COMPLETO)
import { OAuth2Client } from 'google-auth-library';
import User from '../models/UserModel.js';
import Role from '../models/RoleModel.js';
import { generateJWT } from '../utils/generateJWT.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authService = {
  googleLogin: async (token) => {
    try {
      console.log('=== INICIO googleLogin ===');
      console.log('1. Token recibido:', token ? 'SÍ' : 'NO');
      
      // Verificar el token de Google
      console.log('2. Verificando token con Google...');
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { sub, email, given_name, family_name, name } = payload;

      console.log('3. Payload de Google recibido:', {
        sub,
        email,
        given_name,
        family_name,
        name
      });

      // Extraer nombres
      const first_name = given_name || name?.split(' ')[0] || 'Google';
      const last_name = family_name || name?.split(' ').slice(1).join(' ') || 'User';

      console.log('4. Nombres procesados:', { first_name, last_name });

      // 1. Buscar usuario por google_id
      console.log('5. Buscando usuario por google_id:', sub);
      let user = await User.findOne({
        where: { google_id: sub },
        include: { model: Role, as: 'role' },
      });

      console.log('6. Usuario encontrado por google_id:', user ? 'SÍ' : 'NO');

      if (!user) {
        // 2. Si no existe, buscar por email
        console.log('7. Buscando usuario por email:', email);
        user = await User.findOne({
          where: { email },
          include: { model: Role, as: 'role' },
        });

        console.log('8. Usuario encontrado por email:', user ? 'SÍ' : 'NO');

        if (user) {
          // Usuario existe con este email, vincular google_id
          console.log('9. Vinculando google_id al usuario existente');
          user.google_id = sub;
          if (!user.first_name) user.first_name = first_name;
          if (!user.last_name) user.last_name = last_name;
          await user.save();
          console.log('10. Usuario actualizado y guardado');
        } else {
          // 3. Usuario totalmente nuevo - crear con rol 'pending'
          console.log('11. Usuario nuevo, buscando rol pending...');
          
          let pendingRole = await Role.findOne({ where: { name: 'pending' } });
          console.log('12. Rol pending encontrado:', pendingRole ? 'SÍ (id: ' + pendingRole?.id + ')' : 'NO');
          
          if (!pendingRole) {
            console.error('❌ ERROR CRÍTICO: No existe el rol "pending" en la base de datos');
            throw new Error('El rol "pending" no existe en la base de datos. Por favor, créalo manualmente.');
          }

          console.log('15. Creando nuevo usuario con datos:', {
            email,
            google_id: sub,
            first_name,
            last_name,
            role_id: pendingRole.id
          });

          user = await User.create({
            email,
            google_id: sub,
            first_name,
            last_name,
            role_id: pendingRole.id,
            status: 'active',
          });

          console.log('16. Usuario creado con id:', user.id);

          // Recargar para obtener la relación con el rol
          console.log('17. Recargando usuario con relación role...');
          await user.reload({ include: { model: Role, as: 'role' } });
          
          console.log('18. Usuario recargado. Role:', user.role ? user.role.name : 'NO TIENE ROLE');
        }
      }

      // Validar que el usuario existe
      console.log('19. Validación final - Usuario existe:', user ? 'SÍ' : 'NO');
      
      if (!user) {
        console.error('❌ ERROR: Usuario es null después de todo el proceso');
        throw new Error('No se pudo crear o encontrar el usuario');
      }

      console.log('20. Usuario final:', {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role?.name
      });

      // Generar token JWT
      console.log('21. Generando JWT...');
      const tokenJwt = generateJWT({
        id: user.id,
        email: user.email,
        role: user.role?.name ?? 'pending',
      });

      console.log('22. JWT generado:', tokenJwt ? 'SÍ' : 'NO');

      // Preparar respuesta
      const response = {
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role?.name ?? 'pending',
        },
        token: tokenJwt,
      };

      console.log('23. Respuesta preparada:', response);
      console.log('=== FIN googleLogin EXITOSO ===');
      
      return response;
      
    } catch (error) {
      console.error('❌ ERROR CAPTURADO en authService.googleLogin:');
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  },
};

export default authService;