/**
 * @file k6-scripts.js
 * @description
 * Este script de k6 está diseñado para realizar pruebas de carga y estrés en la API de Items.
 *
 * Pruebas Definidas:
 * 1. Prueba de Carga (load_test):
 *    - Objetivo: Simular un nivel de tráfico normal o esperado en la aplicación.
 *    - Metodología: Incrementa gradualmente el número de usuarios virtuales (VUs) hasta un pico moderado,
 *      mantiene esa carga durante un período y luego la disminuye gradualmente.
 *    - Propósito: Evaluar el rendimiento y la estabilidad de la API bajo condiciones de uso típicas,
 *      identificar cuellos de botella y asegurar que los tiempos de respuesta y tasas de error
 *      estén dentro de los umbrales aceptables.
 *
 * 2. Prueba de Estrés (stress_test):
 *    - Objetivo: Empujar el sistema más allá de sus límites operativos normales para observar su comportamiento.
 *    - Metodología: Incrementa rápidamente el número de VUs a niveles muy altos, superando la capacidad
 *      esperada del sistema, y mantiene esta carga elevada.
 *    - Propósito: Identificar el punto de quiebre de la aplicación, cómo se degrada el rendimiento bajo
 *      carga extrema y si el sistema puede recuperarse una vez que la carga disminuye. Ayuda a
 *      comprender la robustez y la resiliencia de la API.
 *
 * Operaciones Realizadas por cada Usuario Virtual (VU):
 * - Crear un nuevo ítem (POST /items)
 * - Obtener el ítem recién creado por su ID (GET /items/{id})
 * - Actualizar el ítem (PUT /items/{id})
 * - Eliminar el ítem (DELETE /items/{id})
 * - Obtener todos los ítems (GET /items)
 *
 * Métricas Clave Recopiladas:
 * - Tiempos de respuesta para cada tipo de solicitud (GET, POST, PUT, DELETE).
 * - Tasa de solicitudes fallidas.
 * - Duración de las solicitudes (percentiles, ej., p(95)).
 *
 * Umbrales (Thresholds):
 * - Se definen umbrales para asegurar que la tasa de errores sea baja y que los tiempos de respuesta
 *   estén dentro de los límites aceptables para la prueba de carga.
 */
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend } from 'k6/metrics'; // Para crear métricas personalizadas de tendencia
// import { htmlReport } from "k6/htmlReport"; // Importar para generar el informe HTML

// Definir tendencias personalizadas para los tiempos de respuesta de cada solicitud
// Estas métricas nos permitirán analizar el rendimiento específico de cada endpoint.
const getAllItemsTrend = new Trend('get_all_items_duration'); // Duración de la obtención de todos los ítems
const createItemTrend = new Trend('create_item_duration');    // Duración de la creación de un ítem
const getItemByIdTrend = new Trend('get_item_by_id_duration'); // Duración de la obtención de un ítem por ID
const updateItemTrend = new Trend('update_item_duration');    // Duración de la actualización de un ítem
const deleteItemTrend = new Trend('delete_item_duration');    // Duración de la eliminación de un ítem

// URL base de la API. Puede ser sobrescrita por la variable de entorno K6_API_BASE_URL.
// Esto permite ejecutar las pruebas contra diferentes entornos (desarrollo, staging, producción) sin modificar el script.
const API_BASE_URL = __ENV.K6_API_BASE_URL || 'http://localhost:3000/api';

export const options = {
  scenarios: {
    // Escenario de Prueba de Carga: simula una carga normal en el sistema.
    load_test: {
      executor: 'ramping-vus', // Tipo de ejecutor: incrementa/decrementa VUs gradualmente.
      startVUs: 0, // Comienza con 0 usuarios virtuales.
      stages: [ // Define las etapas de la prueba de carga.
        { duration: '30s', target: 20 }, // Incrementa hasta 20 VUs durante 30 segundos.
        { duration: '1m', target: 20 },  // Mantiene 20 VUs durante 1 minuto.
        { duration: '30s', target: 0 },  // Decrementa hasta 0 VUs durante 30 segundos.
      ],
      gracefulRampDown: '30s', // Tiempo adicional para que los VUs terminen sus iteraciones al finalizar.
      exec: 'crudOperations', // Función que ejecutarán los VUs.
    },
    // Escenario de Prueba de Estrés: busca los límites del sistema.
    stress_test: {
      executor: 'ramping-vus', // Tipo de ejecutor.
      startVUs: 0, // Comienza con 0 usuarios virtuales.
      stages: [ // Define las etapas de la prueba de estrés, con cargas progresivamente mayores.
        { duration: '30s', target: 50 },  // Incrementa a 50 VUs.
        { duration: '1m', target: 50 },   // Mantiene 50 VUs.
        { duration: '30s', target: 100 }, // Incrementa a 100 VUs.
        { duration: '1m', target: 100 },  // Mantiene 100 VUs.
        { duration: '30s', target: 150 }, // Incrementa a 150 VUs.
        { duration: '1m', target: 150 },  // Mantiene 150 VUs.
        { duration: '1m', target: 0 },    // Decrementa a 0 VUs.
      ],
      gracefulRampDown: '30s', // Tiempo adicional para ramp down.
      exec: 'crudOperations', // Función que ejecutarán los VUs.
    },
  },
  thresholds: { // Umbrales: condiciones de éxito/fallo para la prueba.
    http_req_failed: ['rate<0.01'], // La tasa de errores HTTP debe ser menor al 1%.
    http_req_duration: ['p(95)<500'], // El 95% de las solicitudes deben completarse en menos de 500ms.
    // Umbrales específicos para la prueba de carga (load_test)
    'get_all_items_duration{scenario:load_test}': ['p(95)<300'], // p(95) para GET /items < 300ms
    'create_item_duration{scenario:load_test}': ['p(95)<200'],   // p(95) para POST /items < 200ms
    'get_item_by_id_duration{scenario:load_test}': ['p(95)<150'],// p(95) para GET /items/{id} < 150ms
    'update_item_duration{scenario:load_test}': ['p(95)<200'],   // p(95) para PUT /items/{id} < 200ms
    'delete_item_duration{scenario:load_test}': ['p(95)<150'],   // p(95) para DELETE /items/{id} < 150ms
  },
};

// Función principal que define el flujo de operaciones CRUD que cada VU ejecutará.
export function crudOperations() {
  let itemId; // Variable para almacenar el ID del ítem creado.

  // Agrupa las operaciones relacionadas con la creación de un ítem.
  group('Crear Ítem (POST /items)', function () {
    const payload = JSON.stringify({
      name: `TestItem_VU${__VU}_Iter${__ITER}`, // Nombre único para el ítem usando el ID del VU y la iteración.
      description: 'Este es un ítem de prueba creado por k6.',
    });
    const params = {
      headers: {
        'Content-Type': 'application/json', // Especifica el tipo de contenido.
      },
    };
    const res = http.post(`${API_BASE_URL}/items`, payload, params); // Realiza la solicitud POST.

    // Verificaciones (checks) para la respuesta de creación.
    check(res, {
      'Crear: estado es 201': (r) => r.status === 201, // Verifica que el código de estado sea 201 (Creado).
      'Crear: tiene ID de ítem': (r) => r.json('id') !== null, // Verifica que la respuesta contenga un ID.
    });

    // Si la creación fue exitosa y se obtuvo un ID, se guarda para usarlo en las siguientes operaciones.
    if (res.status === 201 && res.json('id')) {
      itemId = res.json('id');
    }
    createItemTrend.add(res.timings.duration); // Agrega la duración de esta solicitud a la métrica de tendencia.
    sleep(1); // Pausa de 1 segundo para simular el "tiempo de pensamiento" de un usuario.
  });

  // Solo procede con las siguientes operaciones si se creó un ítem exitosamente.
  if (itemId) {
    group('Obtener Ítem por ID (GET /items/{id})', function () {
      const res = http.get(`${API_BASE_URL}/items/${itemId}`); // Solicitud GET para obtener el ítem.
      check(res, {
        'ObtenerPorId: estado es 200': (r) => r.status === 200, // Verifica estado 200 (OK).
        'ObtenerPorId: ID de ítem correcto': (r) => r.json('id') === itemId, // Verifica que el ID coincida.
      });
      getItemByIdTrend.add(res.timings.duration);
      sleep(1);
    });

    group('Actualizar Ítem (PUT /items/{id})', function () {
      const payload = JSON.stringify({
        name: `UpdatedTestItem_VU${__VU}_Iter${__ITER}`, // Nuevo nombre para el ítem.
        description: 'Este ítem ha sido actualizado por k6.',
      });
      const params = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const res = http.put(`${API_BASE_URL}/items/${itemId}`, payload, params); // Solicitud PUT para actualizar.
      check(res, {
        'Actualizar: estado es 200': (r) => r.status === 200,
        'Actualizar: nombre actualizado': (r) => r.json('name') === `UpdatedTestItem_VU${__VU}_Iter${__ITER}`,
      });
      updateItemTrend.add(res.timings.duration);
      sleep(1);
    });

    group('Eliminar Ítem (DELETE /items/{id})', function () {
      const res = http.del(`${API_BASE_URL}/items/${itemId}`); // Solicitud DELETE para eliminar.
      check(res, {
        'Eliminar: estado es 204': (r) => r.status === 204, // Verifica estado 204 (Sin Contenido).
      });
      deleteItemTrend.add(res.timings.duration);
      sleep(1);
    });
  }

  // Esta operación se ejecuta independientemente de si se creó un ítem o no en la iteración actual.
  group('Obtener Todos los Ítems (GET /items)', function () {
    const res = http.get(`${API_BASE_URL}/items`); // Solicitud GET para obtener todos los ítems.
    check(res, {
      'ObtenerTodos: estado es 200': (r) => r.status === 200,
      'ObtenerTodos: es un array': (r) => Array.isArray(r.json()), // Verifica que la respuesta sea un array.
    });
    getAllItemsTrend.add(res.timings.duration);
    sleep(1);
  });
}

// Función para generar un informe HTML al final de la prueba.
/*
export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data), // Genera 'summary.html' con los resultados
  };
}
*/