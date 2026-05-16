<?php

namespace Database\Seeders;

use App\Models\AvailableMonth;
use App\Models\Car;
use App\Models\Regional;
use App\Models\Society;
use App\Models\User;
use App\Models\Validator;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::create([
        //     'username' => 'ahmad',
        //     'password' => 'password123',
        // ]);
        // User::create([
        //     'username' => 'naufal',
        //     'password' => 'password123',
        // ]);


        // Validator::create([
        //     'user_id' => 6,
        //     'role' => 'officer',
        //     'name' => 'ahmad'
        // ]);
        // Validator::create([
        //     'user_id' => 7,
        //     'role' => 'validator',
        //     'name' => 'naufal'
        // ]);

        // Car::create([
        //     'car_name' => "Toyota FT 86",
        //     'brand'  => "Toyota",
        //     'price' => 900000000,
        //     'description' => 'Toyota FT 86 car is the best'
        // ]);

        // AvailableMonth::create([
        //     'car_id' => 1,
        //     'month'  => 12,
        //     'description' => '12 month',
        // ]);

        // Regional::create([
        //     'province' => 'Jawa Tengah',
        //     'district'  => 'Kebumen'
        // ]);

        Society::create([
            'id_card_number' => '00000000',
            'password' => bcrypt('password123'),
            'name' => 'muzamil',
            'born_date' => '2000-1-1',
            'gender' => 'male',
            'address' => 'kebumen',
            'regional_id' => 3,
            'login_tokens' => null
        ]);

        Society::create([
            'id_card_number' => '00000001',
            'password' => bcrypt('password123'),
            'name' => 'raffa',
            'born_date' => '2000-1-1',
            'gender' => 'male',
            'address' => 'kebumen',
            'regional_id' => 3,
            'login_tokens' => null
        ]);
    }
}
