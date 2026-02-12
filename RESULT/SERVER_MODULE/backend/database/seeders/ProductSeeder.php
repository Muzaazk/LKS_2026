<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('products')->insert([
            'name' => 'Laptop Asus ROG',
            'category_id' => 1,
            'price' => 15000000,
            'stock' => 5,
            'description' => 'Laptop gaming 16GB RAM'
        ]);
        DB::table('products')->insert([
            'name' => 'Smartphone Samsung S23',
            'category_id' => 1,
            'price' => 12000000,
            'stock' => 8,
            'description' => 'HP Android terbaru'
        ]);DB::table('products')->insert([
            'name' => 'Snack Kentang',
            'category_id' => 2,
            'price' => 10000,
            'stock' => 100,
            'description' => 'Snack rasa original 100gr'
        ]);DB::table('products')->insert([
            'name' => 'Minuman Soda',
            'category_id' => 2,
            'price' => 7000,
            'stock' => 120,
            'description' => 'Minuman bersoda 330ml'
        ]);DB::table('products')->insert([
            'name' => 'Kaos Polos',
            'category_id' => 3,
            'price' => 75000,
            'stock' => 50,
            'description' => 'Kaos polos cotton combed'
        ]);
    }
}
